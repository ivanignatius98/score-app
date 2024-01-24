<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '../../../components/General/Modal.svelte';
	import SlideOver from '../../../components/General/SlideOver.svelte';
	import ListItem from '../../../components/General/ListItem.svelte';
	import { getInitials } from '../../../helpers/general.js';
	import { navbarStore } from '../../../stores/navbar.ts';
	import type { Match, NavValue, Player } from '../../../types';
	import { Types } from 'mongoose';
	import Dropdown from '../../../components/General/Dropdown.svelte';

	export let data;
	let name = '';
	let selectedId: string = '';
	let isLoading = false;
	let showDropdown = false;

	let matches: (Match & { _id?: string })[] = [];
	let players: Player[] = [];
	let playerMap = new Map();
	let showSidePanel = false;
	let seriesId: string = '';

	function init() {
		navbarStore.update((current: NavValue) => ({
			...current,
			title: 'Matches',
			button: {
				label: 'Create',
				action: () => {
					showSidePanel = true;
				}
			},
			breadcrumbs: [{ href: '#', label: 'Series' }]
		}));

		// seriesStore.update(() => {
		// 	return {
		// 		matches: ['Matches']
		// 	};
		// });
		matches = data.matches || [];
		players = data.players || [];
		playerMap = data.playersMap || new Map();
		seriesId = data.series_id ?? '';
	}
	init();
	//#region teamhandling
	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};

	interface TeamItem extends Player {
		initials: string;
	}

	let openModal = false;
	let teamA: TeamItem[] = [];
	let teamAIds: Set<Types.ObjectId> = new Set();
	let teamB: TeamItem[] = [];
	let teamBIds: Set<Types.ObjectId> = new Set();

	$: {
		if (!showSidePanel) {
			teamA = [];
			teamAIds = new Set();
			teamB = [];
			teamBIds = new Set();
			name = 'Match ' + (matches.length + 1);
			selectedId = '';
		}
	}

	const handleAddTeam = async (team: string, person: Player) => {
		const stringId = person._id;
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
				temp.splice(foundIndex, 1);
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
				temp.splice(foundIndex, 1);
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
	//#region open detail
	interface itemProps {
		detail: Match & { _id: string };
	}
	const handleItemClicked = ({ detail }: itemProps) => {
		selectedId = detail._id;
		const { aTeam, bTeam } = detail;
		teamA = aTeam.players.map((_id) => {
			const name = playerMap.get(_id) || '';
			return {
				_id,
				name,
				initials: getInitials(name)
			};
		});
		teamB = bTeam.players.map((_id) => {
			const name = playerMap.get(_id) || '';
			return {
				_id,
				name,
				initials: getInitials(name)
			};
		});

		teamAIds = new Set([...aTeam.players]);
		teamBIds = new Set([...bTeam.players]);
		showSidePanel = true;
		name = detail.name;
	};
	//#endregion
</script>

<div class="flow-root mt-6">
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each matches as match}
			<li>
				<ListItem
					item={{ ...match, desc: new Date(match.createdAt).toDateString() }}
					on:itemClicked={handleItemClicked}
				/>
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

<SlideOver bind:showSidePanel title={`${selectedId ? 'Update' : 'Create New'}  Match`}>
	<form
		method="post"
		action="?/store"
		use:enhance={({ formData, formElement, cancel }) => {
			// Before form submission to server
			// Optimistic UI
			const name = String(formData.get('name'));
			const arrA = [...teamAIds];
			const arrB = [...teamBIds];
			const aIds = arrA.map((row) => new Types.ObjectId(row));
			const bIds = arrB.map((row) => new Types.ObjectId(row));
			const newMatchToSave = {
				_id: '',
				name,
				status: 'upcoming',
				aTeam: { players: aIds, score: 0 },
				bTeam: { players: bIds, score: 0 },
				createdBy: new Types.ObjectId('6565fcf005ac129c4a659284'),
				createdAt: new Date(),
				updatedAt: new Date()
			};
			const newMatchItem = {
				...newMatchToSave,
				aTeam: { players: arrA, score: 0 },
				bTeam: { players: arrB, score: 0 }
			};
			if (selectedId == '') {
				matches = [newMatchItem, ...matches];
			} else {
				const index = matches.findIndex((item) => item._id === selectedId);
				if (index == -1) {
					cancel();
					return;
				}
				newMatchToSave._id = selectedId || '';
				newMatchItem._id = selectedId || '';
				// Create a new array with the updated item
				const newArray = [...matches];
				newArray[index] = { ...newArray[index], ...newMatchItem };
				matches = newArray;
			}
			formData.append('data', JSON.stringify(newMatchToSave));
			showSidePanel = false;
			isLoading = true;
			return async ({ update, result }) => {
				if (result.status == 200 && result.type == 'success') {
					if (result.data && Array.isArray(result.data.records)) {
						matches = result.data.records;
					}
				}
				await update();
				isLoading = false;
			};
		}}
		slot="content"
		class="flex flex-1 flex-col justify-between h-full"
	>
		<div class="divide-y divide-gray-200 px-4 sm:px-6">
			<div class="space-y-6">
				<div>
					<input name="series_id" type="hidden" bind:value={seriesId} />
					<label for="name" class="block mb-2 text-sm text-white">Match name</label>
					<input
						type="text"
						name="name"
						bind:value={name}
						class="border text-sm rounded-md block w-full py-2 px-3 bg-gray-800 border-gray-600 placeholder-gray-500 focus:border-indigo-500 text-gray-400"
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
								<div slot="content">
									<div class="overflow-y-auto overflow-x-hidden max-h-64">
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
																	teamAIds.has(person._id) ? 'bg-green-700' : '',
																	'ring-1 ring-green-700 p-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant '
																)}
															>
																Team A
															</button>
															<button
																on:click={() => handleAddTeam('b', person)}
																type="button"
																class={classNames(
																	teamBIds.has(person._id) ? 'bg-green-700' : '',
																	'ring-1 ring-green-700 p-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant '
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
									<div class="p-6 border-t-[1px] border-slate-700">
										<button
											on:click={() => {
												openModal = false;
											}}
											class="p-2 bg-blue-500 w-full rounded-md text-sm disabled:bg-blue-300"
											type="button"
										>
											Dismiss
										</button>
									</div>
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

		<div class="flex flex-shrink-0 p-4 gap-3 items-center">
			<button
				disabled={isLoading}
				type="submit"
				class="flex-1 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Save
			</button>
			<!-- <button
				type="button"
				class="flex-1 rounded-md bg-gray-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-500"
				on:click={() => (showSidePanel = false)}
			>
				Cancel
			</button> -->
			{#if selectedId}
				<input name="id" type="hidden" bind:value={selectedId} />
				<Dropdown bind:showDropdown>
					<button
						slot="button-activator"
						on:click={() => (showDropdown = !showDropdown)}
						type="button"
						class="h-9 w-9 bg-gray-600 hover:bg-gray-500 p-2 rounded-lg"
					>
						<span class="sr-only">actions</span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
							class="nz sb"
							><path
								d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
							></path></svg
						>
					</button>
					<div
						role="none"
						slot="dropdown-items"
						class="origin-bottom-right absolute z-10 right-0 bottom-14 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
						tabindex="-1"
					>
						<a
							href={`/scoring/${selectedId}`}
							class="block px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-0">View Score</a
						>

						<button
							formaction="?/delete"
							class="w-full px-4 py-2 text-sm bg-red-800 hover:bg-red-700 rounded-b-lg text-left"
							>Delete</button
						>
					</div>
				</Dropdown>
			{/if}
		</div>
	</form>
</SlideOver>
