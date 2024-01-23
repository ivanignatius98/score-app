<script lang="ts">
	import Counter from '../../../components/General/Counter.svelte';
	import Modal from '../../../components/General/Modal.svelte';

	import ActionPairs from './ActionPairs.svelte';
	import { navbarStore } from '../../../stores/navbar';
	import type { NavValue, Player, Action } from '../../../types';

	// import { seriesStore } from '../../stores/series';

	// const colors = ['red', 'orange', 'yellow'];

	// let active = '';

	// let navValue = { matches: [''] };

	// const unsubscribe = seriesStore.subscribe((value) => {
	// 	navValue = value;
	// });
	export let data;
	let players: Player[] = [];
	let currTeam: string = '';
	let currAction: Action | null = null;
	let aPlayers: Player[] = [];
	let bPlayers: Player[] = [];
	let openModal = false;
	let history: {
		team: string;
		action: Action;
		player: Player;
		currentPoint: {
			a: number;
			b: number;
		};
	}[] = [];
	let aPoints = 0;
	let bPoints = 0;

	function init() {
		navbarStore.update((current: NavValue) => ({
			...current,
			title: 'Scoring',
			buttonAction: () => {
				// showSidePanel = true;
			},
			breadcrumbs: [{ href: '#', label: 'test' }]
		}));

		aPlayers = data.aPlayers || [];
		bPlayers = data.bPlayers || [];
	}
	init();

	$: {
		if (!openModal) {
			players = [];
			currTeam = '';
			currAction = null;
		}
	}

	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};
	interface itemProps {
		detail: {
			team: string;
			action: { made: boolean; value: string };
		};
	}
	const handleActionClicked = ({ detail }: itemProps) => {
		const { team, action } = detail;
		openModal = true;
		players = team == 'a' ? aPlayers : bPlayers;
		currTeam = team;
		currAction = action;
	};
	const handleActionSubmit = (person: Player) => {
		if (!currAction) return;
		if (currAction?.made) {
			if (currTeam == 'a') aPoints += Number(currAction?.value);
			else if (currTeam == 'b') bPoints += Number(currAction?.value);
		}
		history = [
			...history,
			{
				team: currTeam,
				player: person,
				action: currAction,
				currentPoint: {
					a: aPoints,
					b: bPoints
				}
			}
		];
		openModal = false;
	};
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
		<div class="grid grid-cols-2 gap-2 p-4">
			{#each players as person}
				<button
					type="button"
					on:click={() => {
						handleActionSubmit(person);
					}}
					class=" ring-1 ring-green-700 py-1 px-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant"
				>
					{person.name}
				</button>
			{/each}
		</div>
	</div>
</Modal>
<div class="max-w-xl w-full self-center bg-gray-800 p-12">
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
	<hr class="my-8 border-t border-gray-600 h-0.5" />

	<ActionPairs actionValue="1" on:click={handleActionClicked} />
	<ActionPairs actionValue="2" on:click={handleActionClicked} />

	<hr class="my-8 border-t border-gray-600 h-0.5" />
	<div class="flex justify-evenly items-center shadow-lg">
		<button
			on:click={() => {}}
			type="button"
			class="bg-gray-900 flex flex-1 justify-center text-sm font-semibold py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant"
		>
			History
		</button>

		<button
			on:click={() => {}}
			type="button"
			class="hover:bg-gray-900 flex flex-1 justify-center text-sm font-semibold bg-gray-700 py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant"
		>
			A
		</button>
		<button
			on:click={() => {}}
			type="button"
			class="hover:bg-gray-900 flex flex-1 justify-center text-sm font-semibold bg-gray-700 py-3 px-4 items-center border border-transparent rounded-sm text-white bg-transparant"
		>
			B
		</button>
	</div>
	<section class=" p-4 bg-gray-700">
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
				<span class="bg-blue-500 inline-flex items-center justify-center h-12 w-12 rounded-full">
					<span class="text-lg font-medium leading-none text-white group-hover:text-gray-300"
						>B</span
					>
				</span>
				<span class=" font-semibold">Team B</span>
			</div>
		</div>
		<div class="my-1">
			{#each history as { action, team, player, currentPoint }, i}
				<article class="flex items-center text-sm my-2">
					<!-- <p class="font-thin mr-4">12:00</p> -->
					<p class="font-thin mr-4 w-5">
						{action.made ? `${currentPoint.a}-${currentPoint.b}` : ''}
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
					<span class="pl-2 py-1"> {action.made ? '' : 'Miss'} {player.name} 3 PT Shot</span>
				</article>
			{/each}
		</div>
	</section>
</div>
