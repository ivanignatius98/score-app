<script lang="ts">
	import Counter from '../../../components/General/Counter.svelte';
	import Modal from '../../../components/General/Modal.svelte';

	import ActionPairs from './ActionPairs.svelte';
	import { navbarStore } from '../../../stores/navbar';
	import type { NavValue, Player, Action, Match, StatMap, StatSummary } from '../../../types';
	import { deleteAction, saveAction, updateMatchStatus } from '../../../services/scoring/index.js';
	import ScoreTable from './ScoreTable.svelte';
	import { roundToOneDec } from '../../../helpers/general.js';

	export let data;

	let players: Player[] = [];
	let match: (Match & { _id: string }) | null = null;
	let currTeam: string = '';
	let currAction: Action | null = null;
	let aPlayers: Player[] = [];
	let bPlayers: Player[] = [];
	let openModal = false;
	let history: {
		_id?: string;
		team: string;
		action: Action;
		player: Player | undefined;
	}[] = [];
	let aPoints = 0;
	let bPoints = 0;
	let arrA: StatSummary[] = [];
	let arrB: StatSummary[] = [];

	let currTab = 'playbyplay';
	function init() {
		aPlayers = data.aTeam.players || [];
		bPlayers = data.bTeam.players || [];
		match = data.match;
		history = data.history || [];
		currTab = match?.status == 'archived' ? 'teamA' : 'playbyplay';

		navbarStore.update((current: NavValue) => ({
			...current,
			title: 'Scoring Match ' + match?.number,
			buttons: [
				{
					label: data.match.status == 'archived' ? 'Reopen' : 'Submit',
					action: () => {
						handleCloseMatch();
					}
				}
			],
			backNav: '/matches/' + data.series._id
		}));
	}

	init();

	const handleGenerateStats = () => {
		let playerStats = new Map();

		// count stats
		for (let row of history) {
			const defaultStat: StatMap = {
				FG: {
					made: 0,
					attempt: 0
				},
				'3PT': {
					made: 0,
					attempt: 0
				}
			};
			if (!row.player) {
				return;
			}
			if (playerStats.get(row.player._id)) {
				const plStat = playerStats.get(row.player._id);

				plStat[row.action.type].attempt++;
				plStat[row.action.type].made += row.action.made ? 1 : 0;
				playerStats.set(row.player._id, plStat);
			} else {
				defaultStat[row.action.type].attempt++;
				defaultStat[row.action.type].made += row.action.made ? 1 : 0;

				playerStats.set(row.player._id, { ...defaultStat, player: row.player });
			}
		}

		const getArr = (val: Map<string, Player>) => {
			const temp = [];
			for (let [key] of val) {
				const stat = playerStats.get(key);
				if (stat) {
					const obj = {
						FG: `${stat['FG'].made}/${stat['FG'].attempt}`,
						'FG%': `${
							stat['FG'].attempt == 0
								? '0.0'
								: roundToOneDec((stat['FG'].made / stat['FG'].attempt) * 100)
						}`,
						'3PT': `${stat['3PT'].made}/${stat['3PT'].attempt}`,
						'3PT%': `${
							stat['3PT'].attempt == 0
								? '0.0'
								: roundToOneDec((stat['3PT'].made / stat['3PT'].attempt) * 100)
						}`,
						PTS: stat['3PT'].made * 2 + stat['FG'].made,
						player: stat.player.name
					};
					temp.push(obj);
				}
			}
			return temp;
		};
		if (!data.aMap || !data.bMap) return;
		arrA = getArr(data.aMap);
		arrB = getArr(data.bMap);
	};

	$: {
		if (match && match.status == 'archived') {
			handleGenerateStats();
		}
	}

	$: {
		if (!openModal) {
			players = [];
			currTeam = '';
			currAction = null;
		}
	}
	$: reversedHistory = [...history].reverse();

	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};
	interface itemProps {
		detail: {
			team: string;
			action: Action;
		};
	}

	const handleCloseMatch = async () => {
		if (!match?._id) return;

		const newStatus = match.status == 'archived' ? 'upcoming' : 'archived';
		match.status = newStatus;
		currTab = newStatus == 'archived' ? 'teamA' : 'playbyplay';

		const { success, res } = await updateMatchStatus(match?._id);

		if (success && match) {
			match.status = res;

			navbarStore.update((current: NavValue) => ({
				...current,
				buttons: [
					{
						label: res == 'archived' ? 'Reopen' : 'Submit',
						action: () => {
							handleCloseMatch();
						}
					}
				]
			}));
		}
	};
	const handleDeleteItem = async (_id?: string) => {
		if (!_id) return;
		const index = history.findIndex((item) => item._id === _id);
		if (index !== -1) {
			history.splice(index, 1);
			history = [...history];
		}
		deleteAction(_id);
	};
	const handleActionClicked = ({ detail }: itemProps) => {
		const { team, action } = detail;
		openModal = true;
		players = team == 'a' ? aPlayers : bPlayers;
		currTeam = team;
		currAction = action;
	};

	const handleActionSubmit = async (person: Player) => {
		if (!currAction) return;

		history = [
			...history,
			{
				team: currTeam,
				player: person,
				action: currAction
			}
		];
		openModal = false;
		const { success, record } = await saveAction({
			match_id: match?._id,
			action: currAction,
			person
		});
		if (success) {
			history[history.length - 1]._id = record._id;
		}
	};

	let pointsArr: { a: number; b: number }[] = [];
	$: {
		let aPt = 0;
		let bPt = 0;
		const tempArr = [];

		for (let row of history) {
			if (!data.typeValues) break;

			const val = data.typeValues.get(row.action.type);

			if (row.action.made && val) {
				if (row.team === 'a') {
					aPt += val;
				} else if (row.team === 'b') {
					bPt += val;
				}
			}
			tempArr.push({
				a: aPt,
				b: bPt
			});
		}
		aPoints = aPt;
		bPoints = bPt;
		pointsArr = [...tempArr];
	}
	$: reversedPoints = [...pointsArr].reverse();

	$: postGame = match?.status == 'archived';
</script>

<Modal title="Edit your details" bind:openModal>
	<div slot="content">
		<div class="flex justify-evenly items-center shadow-lg">
			<button
				on:click={() => {
					players = aPlayers;
					currTeam = 'a';
				}}
				type="button"
				class={classNames(
					currTeam == 'a' ? 'bg-gray-900' : '',
					'hover:bg-gray-900 flex flex-1 justify-center text-sm font-semibold py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant'
				)}
			>
				Team A
			</button>
			<button
				on:click={() => {
					players = bPlayers;
					currTeam = 'b';
				}}
				type="button"
				class={classNames(
					currTeam == 'b' ? 'bg-gray-900' : '',
					'hover:bg-gray-900 flex flex-1 justify-center text-sm font-semibold py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant'
				)}
			>
				Team B
			</button>
		</div>
		<div class="grid grid-cols-2 gap-4 p-4">
			{#each players as person}
				<button
					type="button"
					on:click={() => {
						handleActionSubmit(person);
					}}
					class=" ring-1 ring-green-700 p-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant"
				>
					{person.name}
				</button>
			{/each}
		</div>
	</div>
</Modal>
<div class="max-w-xl w-full self-center bg-gray-800 pt-12 px-0 sm:p-12 rounded-md">
	<div class="flex items-center justify-center gap-5">
		<div>
			<span class="bg-red-500 inline-flex items-center justify-center h-12 w-12 rounded-full">
				<span class="text-lg font-medium leading-none text-white group-hover:text-gray-300">A</span>
			</span>
		</div>
		<Counter bind:count={aPoints} />
		-
		<Counter bind:count={bPoints} />
		<div>
			<span class="bg-blue-500 inline-flex items-center justify-center h-12 w-12 rounded-full">
				<span class="text-lg font-medium leading-none text-white group-hover:text-gray-300">B</span>
			</span>
		</div>
	</div>

	{#if !postGame}
		<hr class="my-8 border-t border-gray-600 h-0.5" />
		<div class="px-4">
			<ActionPairs action={{ value: 1, type: 'FG' }} on:click={handleActionClicked} />
			<ActionPairs action={{ value: 2, type: '3PT' }} on:click={handleActionClicked} />
		</div>

		<hr class="mt-8 border-t border-gray-600 h-0.5" />
	{/if}

	<div class=" bg-gray-700 rounded-sm mt-8">
		<div class="flex justify-evenly items-center shadow-lg">
			{#if postGame}
				<button
					on:click={() => {
						currTab = 'teamA';
					}}
					type="button"
					class={classNames(
						currTab == 'teamA' ? 'bg-gray-900' : 'hover:bg-gray-900',
						'flex flex-1 justify-center text-sm font-semibold py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant'
					)}
				>
					Team A
				</button>
				<button
					on:click={() => {
						currTab = 'teamB';
					}}
					type="button"
					class={classNames(
						currTab == 'teamB' ? 'bg-gray-900' : 'hover:bg-gray-900',
						'flex flex-1 justify-center text-sm font-semibold py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant'
					)}
				>
					Team B
				</button>
			{/if}
			<button
				on:click={() => {
					currTab = 'playbyplay';
				}}
				type="button"
				class={classNames(
					currTab == 'playbyplay' ? 'bg-gray-900' : 'hover:bg-gray-900',
					'flex flex-1 justify-center text-sm font-semibold py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant'
				)}
			>
				{postGame ? 'History' : 'Play by Play'}
			</button>
		</div>
		<section class="p-4">
			{#if currTab == 'playbyplay'}
				<div class="hidden sm:flex items-center mb-10">
					<div class="flex gap-4 flex-1 justify-center items-center">
						<span class="bg-red-500 inline-flex items-center justify-center h-12 w-12 rounded-full">
							<span class="text-lg font-medium leading-none text-white group-hover:text-gray-300"
								>A</span
							>
						</span>
						<span class=" font-semibold">Team A</span>
					</div>
					<div class="flex gap-4 flex-1 justify-center items-center">
						<span
							class="bg-blue-500 inline-flex items-center justify-center h-12 w-12 rounded-full"
						>
							<span class="text-lg font-medium leading-none text-white group-hover:text-gray-300"
								>B</span
							>
						</span>
						<span class=" font-semibold">Team B</span>
					</div>
				</div>
				<div class="my-1">
					{#each reversedHistory as { action, team, player, _id }, i}
						<article class="flex items-center text-sm my-2 relative">
							<!-- <p class="font-thin mr-4">12:00</p> -->
							<p class="font-thin w-10">
								{action.made && reversedPoints[i]
									? `${reversedPoints[i]?.a}-${reversedPoints[i]?.b}`
									: ''}
							</p>
							<span
								class={classNames(
									team == 'a' ? 'bg-red-500' : 'bg-blue-500',
									' inline-flex items-center justify-center rounded-full h-8 w-8'
								)}
							>
								<span class="text-md font-medium leading-none text-white group-hover:text-gray-300"
									>{team.toUpperCase()}</span
								>
							</span>
							<span class={classNames(action.made ? 'font-semibold' : '', 'pl-2 py-1')}>
								{action.made ? '' : 'Miss'} {player?.name} {action.type} Shot</span
							>
							{#if match?.status != 'archived'}
								<button
									class="absolute right-0 w-10 hover:bg-slate-800 active:bg-slate-800 rounded-full p-2"
									on:click={() => handleDeleteItem(_id)}
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke-width="1.5"
										stroke="currentColor"
										aria-hidden="true"
										class="oc se"
										><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"
										></path></svg
									>
								</button>
							{/if}
						</article>
					{/each}
				</div>
			{:else if currTab == 'teamA'}
				<ScoreTable bind:data={arrA} />
			{:else if currTab == 'teamB'}
				<ScoreTable bind:data={arrB} />
			{/if}
		</section>
	</div>
</div>
