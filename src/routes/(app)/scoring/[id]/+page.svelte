<script lang="ts">
	import Counter from '../../../../components/General/Counter.svelte';
	import Modal from '../../../../components/General/Modal.svelte';
	import LandscapeOnly from '../../../../components/General/LandscapeOnly.svelte';

	import { navbarStore } from '../../../../stores/navbar';
	import type { NavValue, Player, Action, Match, StatMap, StatSummary } from '../../../../types';
	import {
		deleteAction,
		saveAction,
		updateMatchStatus
	} from '../../../../services/scoring/index.js';
	import ScoreTable from '../../../../components/Scoring/ScoreTable.svelte';
	import { roundToOneDec } from '../../../../helpers/general.js';
	import { goto } from '$app/navigation';

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

	let selectedPlayer: Player | null = null;

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
			backButton: {
				action: () => goto('/matches/' + data.series._id),
				label: 'Back'
			}
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
						FG: `${stat['FG'].made + stat['3PT'].made}/${stat['FG'].attempt + stat['3PT'].attempt}`,
						'FG%': `${roundToOneDec(
							((stat['FG'].made + stat['3PT'].made) / (stat['FG'].attempt + stat['3PT'].attempt)) *
								100
						)}`,
						'2PT': `${stat['FG'].made}/${stat['FG'].attempt}`,
						'3PT': `${stat['3PT'].made}/${stat['3PT'].attempt}`,
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
			currAction = null;
		}
	}
	$: reversedHistory = [...history].reverse();

	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};
	const handleCloseMatch = async () => {
		if (!match?._id) return;

		const newStatus = match.status == 'archived' ? 'upcoming' : 'archived';
		match.status = newStatus;
		currTab = newStatus == 'archived' ? 'teamA' : 'playbyplay';

		const { success, res } = await updateMatchStatus({
			_id: match._id,
			status: newStatus,
			aPoints,
			bPoints
		});

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
	const handleZoneClicked = (zone: string) => {
		if (selectedPlayer && (zone == null || zone != currZone)) {
			openModal = true;
		}
		currZone = zone == currZone ? null : zone;
	};

	const handleActionClicked = async (actionstr: string) => {
		const threePointZones = new Set([
			'LEFT-CORNER',
			'RIGHT-CORNER',
			'LEFT-WING',
			'RIGHT-WING',
			'POINT'
		]);

		const isThreePointer = currZone && threePointZones.has(currZone);

		if (actionstr === 'MADE SHOT' || actionstr === 'MISSED SHOT') {
			currAction = {
				value: isThreePointer ? 3 : 2,
				made: actionstr === 'MADE SHOT',
				type: isThreePointer ? '3PT' : 'FG',
				zone: currZone
			};
		}

		if (!currAction || !selectedPlayer) return;

		history = [
			...history,
			{
				team: currTeam,
				player: selectedPlayer,
				action: currAction
			}
		];
		openModal = false;
		currZone = null;
		currAction = null;
		currTeam = '';
		selectedPlayer = null;

		const { success, record } = await saveAction({
			match_id: match?._id,
			action: currAction,
			person: selectedPlayer
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

	$: currColor =
		currTeam == 'a' ? 'fill-red-800' : currTeam == 'b' ? 'fill-blue-800' : 'fill-gray-600';
	$: currColorHover =
		currTeam == 'a'
			? 'hover:fill-red-800'
			: currTeam == 'b'
			  ? 'hover:fill-blue-800'
			  : 'hover:fill-gray-600';

	let actions = ['MADE SHOT', 'MISSED SHOT'];
	// let actions = ['MADE SHOT', 'MISSED SHOT', 'STEAL', 'BLOCK'];
	let currZone: string | null = null;

	const handlePlayerSelect = (team: string, person: Player) => {
		if (currZone && selectedPlayer?._id != person._id && currTeam == team) {
			openModal = true;
		}
		currTeam = team;
		selectedPlayer = selectedPlayer?._id == person._id ? null : person;
	};
</script>

<Modal title={`Action ${currZone}`} bind:openModal>
	<div slot="content">
		<div class="grid grid-cols-2 gap-4 p-4">
			{#each actions as action}
				<button
					type="button"
					on:click={() => handleActionClicked(action)}
					class=" ring-1 ring-green-700 hover:bg-green-700 transition-colors duration-200 py-4 items-center border border-transparent rounded-sm shadow-sm text-white font-semibold bg-transparant"
				>
					{action}
				</button>
			{/each}
		</div>
	</div>
</Modal>
<LandscapeOnly>
	<div class="flex items-center rounded-md justify-center gap-5 bg-gray-800 py-8 mb-4">
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
		<div class="justify-center flex text-sm">
			<menu class="min-w-[100px]">
				{#each aPlayers as person}
					<li>
						<button
							type="button"
							on:click={() => {
								handlePlayerSelect('a', person);
							}}
							class={classNames(
								selectedPlayer?._id == person._id
									? 'bg-indigo-700 hover:bg-indigo-800'
									: ' bg-gray-800 hover:bg-gray-700',
								'w-full my-2 p-4 items-center border border-transparent rounded-md shadow-sm text-white'
							)}
						>
							{person.name}
						</button>
					</li>
				{/each}
			</menu>
			<div class="flex-1 p-2">
				<svg
					id="Layer_2"
					data-name="Layer 2"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 742 492.56"
					class="stroke-gray-900 stroke-[8px] fill-gray-700"
				>
					<g id="Layer_1-2" data-name="Layer 1">
						<rect
							class={classNames(
								currColorHover,
								currZone == 'RIGHT-ELBOW' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('RIGHT-ELBOW')}
							x="452.02"
							y="101.08"
							width="217.36"
							height="264.32"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('RIGHT-ELBOW');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Elbow Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'LEFT-ELBOW' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('LEFT-ELBOW')}
							x="70.61"
							y="101.08"
							width="217.36"
							height="264.32"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('LEFT-ELBOW');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Elbow Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'FREE-THROW' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('FREE-THROW')}
							x="288.39"
							y="237.06"
							width="161.62"
							height="113.81"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('FREE-THROW');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Elbow Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'LEFT-CORNER' ? currColor : '',
								'transition-colors duration-300 outline-none border-none '
							)}
							on:click={() => handleZoneClicked('LEFT-CORNER')}
							x="4"
							y="4"
							width="66.61"
							height="194.16"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('LEFT-CORNER');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Elbow Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'RIGHT-CORNER' ? currColor : '',
								'transition-colors duration-300 outline-none border-none '
							)}
							on:click={() => handleZoneClicked('RIGHT-CORNER')}
							x="671.39"
							y="4"
							width="66.61"
							height="194.16"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('RIGHT-CORNER');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Corner Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'SHORT-LEFT-CORNER' ? currColor : '',
								'transition-colors duration-300 outline-none border-none '
							)}
							on:click={() => handleZoneClicked('SHORT-LEFT-CORNER')}
							x="70.61"
							y="4"
							width="189.21"
							height="97.08"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('SHORT-LEFT');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Short Left Corner Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'SHORT-RIGHT-CORNER' ? currColor : '',
								'transition-colors duration-300 outline-none border-none '
							)}
							on:click={() => handleZoneClicked('SHORT-RIGHT-CORNER')}
							x="478.59"
							y="4"
							width="192.8"
							height="97.08"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('SHORT-RIGHT-CORNER');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Short Right Corner Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'LEFT-LOW-POST' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('LEFT-LOW-POST')}
							x="259.82"
							y="4"
							width="28.16"
							height="253.28"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('LEFT-LOW-POST');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Left Low Post Area"
						/>
						<path
							class={classNames(
								currColorHover,
								currZone == 'LEFT-WING' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('LEFT-WING')}
							d="M235.6,365.4l-62.79,123.16H4V198.16h66.61s55.19,121.07,164.99,167.25Z"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('LEFT-WING');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Left Wing Area"
						/>
						<path
							class={classNames(
								currColorHover,
								currZone == 'RIGHT-WING' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('RIGHT-WING')}
							d="M506.4,365.4l62.79,123.16h168.81s0-290.41,0-290.41h-66.61s-55.19,121.07-164.99,167.25Z"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('RIGHT-WING');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Wing Area"
						/>
						<path
							class={classNames(
								currColorHover,
								currZone == 'POINT' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('POINT')}
							d="M173.28,488.56h395.91s-62.79-123.16-62.79-123.16c0,0-95.67,67.57-270.8,0-11.66,22.86-62.32,123.16-62.32,123.16Z"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('POINT');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Point Area"
						/>
						<path
							class={classNames(
								currColorHover,
								currZone == 'HIGH-POST' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('HIGH-POST')}
							d="M235.6,365.4l52.37-104.74s8.73,76.58,81.23,76.02c0,0,73.63,3.94,80.95-79.4,12.95,24.21,56.25,108.12,56.25,108.12,0,0-95.1,67.01-270.8,0Z"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('HIGH-POST');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="High Post Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'PAINT' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('PAINT')}
							x="287.97"
							y="4"
							width="161.62"
							height="256.66"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('PAINT');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Paint Area"
						/>
						<rect
							class={classNames(
								currColorHover,
								currZone == 'RIGHT-LOW-POST' ? currColor : '',
								'transition-colors duration-300 outline-none border-none'
							)}
							on:click={() => handleZoneClicked('RIGHT-LOW-POST')}
							x="449.59"
							y="4"
							width="28.16"
							height="253.28"
							on:keydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									handleZoneClicked('RIGHT-LOW-POST');
								}
							}}
							tabindex="0"
							role="button"
							aria-label="Right Low Post Area"
						/>
					</g>
				</svg>
			</div>
			<menu class="min-w-[100px]">
				{#each bPlayers as person}
					<li>
						<button
							type="button"
							on:click={() => {
								handlePlayerSelect('b', person);
							}}
							class={classNames(
								selectedPlayer?._id == person._id
									? 'bg-indigo-700 hover:bg-indigo-800'
									: ' bg-gray-800 hover:bg-gray-700',
								'w-full my-2 p-4 items-center border border-transparent rounded-md shadow-sm text-white '
							)}
						>
							{person.name}
						</button>
					</li>
				{/each}
			</menu>
		</div>
	{/if}
	<div class=" bg-gray-800 rounded-sm mt-8">
		<div class="flex justify-evenly items-center shadow-lg">
			{#if postGame}
				<button
					on:click={() => {
						currTab = 'teamA';
					}}
					type="button"
					class={classNames(
						currTab == 'teamA' ? 'bg-indigo-700 hover:bg-indigo-800' : 'hover:bg-gray-700',
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
						currTab == 'teamB' ? 'bg-indigo-700 hover:bg-indigo-800' : 'hover:bg-gray-700',
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
					currTab == 'playbyplay' ? 'bg-indigo-700 hover:bg-indigo-800' : 'hover:bg-gray-700',
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
								{action.made ? '' : 'Miss'}
								{player?.name}
								{action.type}
								{action.zone ? `Shot from the ${action.zone}` : ''}</span
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
</LandscapeOnly>

<style>
</style>
