<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '../../../components/General/Modal.svelte';
	import SlideOver from '../../../components/General/SlideOver.svelte';
	import MatchItem from '../../../components/Matches/MatchItem.svelte';
	import { navbarStore } from '../../../stores/navbar.js';
	import { seriesStore } from '../../../stores/series.js';
	import type { Match, Player } from '../../../types';
	import { Types } from 'mongoose';
	type MatchStatus = 'upcoming' | 'live' | 'archived';

	export let data;
	// $: ({ matches = [], players } = data as { matches: Match[]; players: Player[] });
	// $: matches = (data.matches || []).slice();
	// $: players = data.players || [];
	let matches: Match[] = [];
	let players: Player[] = [];
	let showSidePanel = false;
	let admin = false;
	function initNavbar() {
		navbarStore.update(() => {
			return {
				title: 'Matches',
				buttonAction: () => {
					showSidePanel = true;
				}
			};
		});
		// seriesStore.update(() => {
		// 	return {
		// 		matches: ['Matches']
		// 	};
		// });
		matches = data.matches || [];
		players = data.players || [];
	}
	initNavbar();
	//#region teamhandling
	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};

	interface TeamItem extends Player {
		initials: string;
	}

	let openModal = false;
	let teamA: TeamItem[] = [];
	let teamAIds: Set<string> = new Set();
	let teamB: TeamItem[] = [];
	let teamBIds: Set<string> = new Set();
	const getInitials = (name: string) => {
		const initials = name
			.split(' ')
			.map((word: string) => word.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('');
		return initials;
	};

	const handleAddTeam = async (team: string, person: Player) => {
		const stringId = String(person._id);
		const initials = getInitials(person.name);

		let [arr1, set1, arr2, set2] =
			team === 'a' ? [teamA, teamAIds, teamB, teamBIds] : [teamB, teamBIds, teamA, teamAIds];

		if (!arr1 || !set1) return;
		if (!arr2 || !set2) return;

		if (set1.has(stringId)) {
			set1.delete(stringId);
			const foundIndex = arr1.findIndex((obj) => obj._id === person._id);
			if (foundIndex !== -1) {
				const temp = [...arr1];
				const [deleted] = temp.splice(foundIndex, 1);
				arr1 = temp;
				set1 = new Set([...set1]);
			}
		} else {
			if (arr1.length < 5) {
				set1 = new Set([...set1, stringId]);
				arr1 = [...arr1, { ...person, initials }];
			}
		}

		if (set2.has(stringId)) {
			set2.delete(stringId);
			const foundIndex = arr2.findIndex((obj) => obj._id === person._id);
			if (foundIndex !== -1) {
				const temp = [...arr2];
				const [deleted] = temp.splice(foundIndex, 1);
				arr2 = temp;
				set2 = new Set([...set2]);
			}
		}

		if (team == 'a') {
			teamA = [...arr1];
			teamAIds = set1;
			teamB = [...arr2];
			teamBIds = set2;
		} else if (team == 'b') {
			teamB = [...arr1];
			teamBIds = set1;
			teamA = [...arr2];
			teamAIds = set2;
		}
	};
	//#endregion
</script>

<div class="flow-root mt-6">
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each matches as match}
			<li>
				{#if match}
					<MatchItem bind:match bind:admin />
				{/if}
			</li>
		{/each}
	</ul>
</div>
<div class="mt-6">
	<button
		type="button"
		class="w-full flex justify-center items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-white bg-opacity-10 hover:bg-opacity-20"
	>
		View all
	</button>
</div>

<SlideOver bind:showSidePanel title="Create New Match">
	<form
		method="post"
		action="?/create"
		use:enhance={({ formData, formElement }) => {
			// Before form submission to server
			// Optimistic UI
			const name = String(formData.get('name'));
			const aIds = [...teamAIds].map((row) => new Types.ObjectId(row));
			const bIds = [...teamBIds].map((row) => new Types.ObjectId(row));
			const newMatch = {
				name,
				status: 'upcoming',
				aTeam: { players: aIds, score: 0 },
				bTeam: { players: bIds, score: 0 },
				createdBy: new Types.ObjectId('6565fcf005ac129c4a659284'),
				createdAt: new Date(),
				updatedAt: new Date()
			};

			matches = [newMatch, ...matches];
			formData.append('data', JSON.stringify(newMatch));
			// return async ({ update, result }) => {
			// 	// 	// After form submission to server
			// 	// 	const currentTodos = await getCurrentTodos();
			// 	// 	// change todos to currentTodos from server
			// 	// 	todos = currentTodos;
			// 	// 	console.log('1.update todos with the right id from mongodb', todos);
			// 	// 	isLoading = false;
			// 	await update();
			// };
		}}
		slot="content"
		class="flex flex-1 flex-col justify-between h-full"
	>
		<div class="divide-y divide-gray-200 px-4 sm:px-6">
			<div class="space-y-6">
				<div>
					<label for="name" class="block mb-2 text-sm text-white">First name</label>
					<input
						type="text"
						name="name"
						class="border text-sm rounded-md block w-full py-2 px-3 bg-gray-800 border-gray-600 placeholder-gray-500 focus:border-indigo-500 text-gray-500"
						placeholder="Match 1"
						required
					/>
				</div>
				<div>
					<h3 class="text-sm font-medium text-white">Team A Members</h3>
					<div class="mt-2">
						<div class="flex gap-1">
							{#each teamA as person}
								<button class="group" on:click={() => handleAddTeam('a', person)} type="button">
									<span
										class="bg-blue-500 group-hover:bg-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-full"
									>
										<span
											class="text-sm font-medium leading-none text-white group-hover:text-gray-300"
											>{person?.initials}</span
										>
									</span>
								</button>
							{/each}
							<button
								on:click={() => (openModal = true)}
								type="button"
								class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								<span class="sr-only">Add team member</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									class="nz sb"
									><path
										d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
									></path></svg
								>
							</button>
							<Modal title="Edit your details" bind:openModal>
								<div class="overflow-y-auto overflow-x-hidden max-h-64" slot="content">
									<ul role="list" class="-my-4 text-sm py-8">
										{#each players as person}
											<li class="py-3 px-8 rounded-md">
												<div class="flex justify-between items-center">
													{person.name}
													<div class="flex gap-2">
														<button
															on:click={() => handleAddTeam('a', person)}
															type="button"
															class={classNames(
																teamAIds.has(String(person._id)) ? 'bg-green-700' : '',
																'ring-1 ring-green-700 py-1 px-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant '
															)}
														>
															Team A
														</button>
														<button
															on:click={() => handleAddTeam('b', person)}
															type="button"
															class={classNames(
																teamBIds.has(String(person._id)) ? 'bg-green-700' : '',
																'ring-1 ring-green-700 py-1 px-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant '
															)}
														>
															Team B
														</button>
													</div>
												</div>
											</li>
										{/each}
									</ul>
								</div>
							</Modal>
						</div>
					</div>
				</div>
				<div>
					<h3 class="text-sm font-medium text-white">Team B Members</h3>
					<div class="mt-2">
						<div class="flex gap-1">
							{#each teamB as person}
								<button class="group" on:click={() => handleAddTeam('b', person)} type="button">
									<span
										class="bg-red-500 group-hover:bg-red-700 inline-flex items-center justify-center h-8 w-8 rounded-full"
									>
										<span
											class="text-sm font-medium leading-none text-white group-hover:text-gray-300"
											>{person?.initials}</span
										>
									</span>
								</button>
							{/each}
							<button
								on:click={() => (openModal = true)}
								type="button"
								class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							>
								<span class="sr-only">Add team member</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									class="nz sb"
									><path
										d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
									></path></svg
								>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-shrink-0 justify-end px-4 py-4">
			<button
				type="button"
				class="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				on:click={() => (showSidePanel = false)}
			>
				Cancel
			</button>
			<button
				type="submit"
				class="ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Save
			</button>
		</div>
	</form>
</SlideOver>
