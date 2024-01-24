<script lang="ts">
	import Counter from '../../../components/General/Counter.svelte';
	import Modal from '../../../components/General/Modal.svelte';

	import ActionPairs from './ActionPairs.svelte';
	import { navbarStore } from '../../../stores/navbar';
	import { enhance } from '$app/forms';
	import type { NavValue, Player, Action, Match } from '../../../types';

	export let data;
	let players: Player[] = [];
	let match: (Match & { _id: string }) | null = null;
	let currTeam: string = '';
	let currAction: Action | null = null;
	let aPlayers: Player[] = [];
	let bPlayers: Player[] = [];
	let openModal = false;
	let history: {
		team: string;
		action: Action;
		player: Player | undefined;
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
			button: {
				label: 'Submit',
				action: () => {}
			},
			breadcrumbs: [{ href: '#', label: 'test' }]
		}));

		aPlayers = data.aTeam.players || [];
		bPlayers = data.bTeam.players || [];
		match = data.match;
		history = data.history || [];
		aPoints = data.aPoints ?? 0;
		bPoints = data.bPoints ?? 0;
	}
	init();

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
		try {
			const response = await fetch('/api/scoring', {
				method: 'POST',
				body: JSON.stringify({ match_id: match?._id }),
				headers: {
					'content-type': 'application/json'
				}
			});

			const jsonRes = await response.json();
			console.log(jsonRes);
		} catch (error) {
			console.error('Error submitting form', error);
		}
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
		if (currAction?.made && currAction?.value) {
			if (currTeam == 'a') aPoints += currAction?.value;
			else if (currTeam == 'b') bPoints += currAction?.value;
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
		try {
			const response = await fetch('/api/scoring', {
				method: 'POST',
				body: JSON.stringify({ match_id: match?._id, action: currAction, person }),
				headers: {
					'content-type': 'application/json'
				}
			});

			const jsonRes = await response.json();
			console.log(jsonRes);
		} catch (error) {
			console.error('Error submitting form', error);
		}
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

	{#if match?.status != 'archived'}
		<hr class="my-8 border-t border-gray-600 h-0.5" />
		<ActionPairs action={{ value: 1, type: 'FG' }} on:click={handleActionClicked} />
		<ActionPairs action={{ value: 2, type: '3PT' }} on:click={handleActionClicked} />
	{/if}

	<hr class="my-8 border-t border-gray-600 h-0.5" />
	<div class=" bg-gray-700 rounded-sm">
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
		<section class="p-4">
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
				{#each reversedHistory as { action, team, player, currentPoint }}
					<article class="flex items-center text-sm my-2">
						<!-- <p class="font-thin mr-4">12:00</p> -->
						<p class="font-thin w-10">
							{action.made && currentPoint ? `${currentPoint?.a}-${currentPoint?.b}` : ''}
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
					</article>
				{/each}
			</div>
		</section>
	</div>
</div>
