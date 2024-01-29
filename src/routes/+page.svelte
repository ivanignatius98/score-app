<script lang="ts">
	import { Types } from 'mongoose';
	import Modal from '../components/General/Modal.svelte';
	import SlideOver from '../components/General/SlideOver.svelte';
	import ListItem from '../components/General/ListItem.svelte';
	import { navbarStore } from '../stores/navbar.ts';
	import type { NavValue, Player, Series } from '../types';
	import { getInitials } from '../helpers/general.js';
	import { enhance } from '$app/forms';
	import Dropdown from '../components/General/Dropdown.svelte';
	let name = '';
	let seriesDate = '';
	let isLoading = false;

	export let data;

	let series: (Series & { id?: string })[] = [];
	let members: Player[] = [];
	let selectedId = '';
	let playerq = '';
	let showSidePanel = false;
	let openModal = false;
	let showDropdown = false;

	const currentDate = new Date();
	const [formattedDate] = currentDate.toISOString().split('T');

	function init() {
		navbarStore.update((current: NavValue) => ({
			...current,
			title: 'Series',
			button: {
				label: 'Create',
				action: () => {
					showSidePanel = true;
				}
			},
			breadcrumbs: [{ href: '#', label: 'test' }]
		}));
		series = data.series || [];
		members = data.members || [];

		seriesDate = formattedDate;
		// delete later
		// showSidePanel = true;
		// openModal = true;
	}
	init();

	$: filteredMembers = members.filter((member) =>
		member.name.toLowerCase().includes(playerq.toLowerCase())
	);
	$: {
		if (!showSidePanel) {
			playerq = '';
			seriesDate = formattedDate;
			name = '';
			playersTmp = [];
			playerIdsTmp = new Set([]);
			players = [];
			playerIds = new Set([]);
			selectedId = '';
			showDropdown = false;
		}
		if (!openModal) {
			playerq = '';
		}
	}

	//#region teamhandling
	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};

	interface TeamItem extends Player {
		initials: string;
		colorClass?: string;
	}
	let playersTmp: TeamItem[] = [];
	let playerIdsTmp: Set<String> = new Set();
	let players: TeamItem[] = [];
	let playerIds: Set<String> = new Set();

	const handleAddPlayer = async (person: Player, skipTmp?: Boolean) => {
		const initials = getInitials(person.name);
		if (playerIdsTmp.has(person.id)) {
			playerIdsTmp.delete(person.id);
			const foundIndex = playersTmp.findIndex((obj) => obj.id === person.id);
			if (foundIndex !== -1) {
				const temp = [...playersTmp];
				temp.splice(foundIndex, 1);
				playersTmp = temp;
				playerIdsTmp = new Set([...playerIdsTmp]);
			}
		} else {
			playerIdsTmp = new Set([...playerIdsTmp, person.id]);
			playersTmp = [...playersTmp, { ...person, initials, colorClass: 'bg-red-500' }];
		}

		if (skipTmp) {
			playerIds = playerIdsTmp;
			players = playersTmp;
		}
	};
	//#endregion

	interface itemProps {
		detail: Series & { id: string };
	}
	const handleItemClicked = ({ detail }: itemProps) => {
		selectedId = detail.id;
		name = detail.name;
		seriesDate = new Date(detail.date).toISOString().split('T')[0];
		players = [...detail.players];
		playerIds = new Set([...detail.playerIds]);
		playersTmp = [...players];
		playerIdsTmp = new Set([...playerIds]);
		showSidePanel = true;
	};
</script>

<div class="flow-root mt-6">
	<!-- {JSON.stringify(series)} -->
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each series as row}
			<li>
				<ListItem
					item={{ ...row, desc: new Date(row.date).toDateString() }}
					on:itemClicked={handleItemClicked}
				/>
			</li>
		{/each}
	</ul>
</div>
<!-- <div class="mt-6">
	<button
		type="button"
		class="w-full flex justify-center items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-white bg-opacity-10 hover:bg-opacity-20"
	>
		View all
	</button>
</div> -->

<SlideOver
	bind:showSidePanel
	title={`${selectedId ? 'Update' : 'Create New'}  Series`}
	description="Fill in the form below"
>
	<form
		method="post"
		action="?/store"
		use:enhance={({ formData, formElement, cancel }) => {
			const name = String(formData.get('name'));
			const arrPlayers = [...players];
			const arrIdPlayers = [...playerIds];
			const newSeries = {
				id: '',
				name,
				players: arrIdPlayers,
				date: seriesDate
			};
			const newSeriesItem = {
				...newSeries,
				players: arrPlayers,
				playerIds: arrIdPlayers,
				matches: []
			};
			if (selectedId == '') {
				series = [newSeriesItem, ...series];
			} else {
				const index = series.findIndex((item) => item.id === selectedId);
				if (index == -1) {
					cancel();
					return;
				}
				newSeries.id = selectedId || '';
				newSeriesItem.id = selectedId || '';
				// Create a new array with the updated item
				const newArray = [...series];
				newArray[index] = { ...newArray[index], ...newSeriesItem };
				series = newArray;
			}
			formData.append('data', JSON.stringify(newSeries));
			isLoading = true;
			return async ({ update, result }) => {
				if (result.status == 200 && result.type == 'success') {
					if (result.data && Array.isArray(result.data.records)) {
						series[0].id = result.data.id;
					}
				}
				isLoading = false;
				showSidePanel = false;
				await update();
			};
		}}
		slot="content"
		class="flex flex-1 flex-col justify-between h-full"
	>
		<div class="divide-y divide-gray-200 px-4 sm:px-6">
			<div class="space-y-6">
				<div>
					<label for="name" class="block mb-2 text-sm text-white">Series name</label>
					<input
						type="text"
						name="name"
						bind:value={name}
						class="border text-sm rounded-md block w-full py-2 px-3 bg-gray-800 border-gray-600 placeholder-gray-500 focus:border-indigo-500 text-gray-300"
						placeholder="Series 1"
						required
					/>
				</div>
				<div>
					<label for="series-date" class="block mb-2 text-sm text-white">Date</label>
					<input
						type="date"
						name="series-date"
						bind:value={seriesDate}
						class="border text-sm rounded-md block w-full py-2 px-3 bg-gray-800 border-gray-600 placeholder-gray-500 focus:border-indigo-500 text-gray-300"
						required
					/>
				</div>
				<div>
					<h3 class="text-sm font-medium text-white">Players for the day</h3>
					<div class="mt-2">
						<div class="flex gap-1 flex-wrap">
							{#each players as person}
								<button class="group" on:click={() => handleAddPlayer(person, true)} type="button">
									<span
										class={classNames(
											person.colorClass,
											'inline-flex items-center justify-center h-8 w-8 rounded-full'
										)}
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
							<Modal title="Select Players" bind:openModal>
								<div slot="header">
									<div class="mt-2">
										<input
											type="search"
											class="border text-sm rounded-md block w-full py-2 px-3 bg-gray-900 border-gray-900 placeholder-gray-500 focus:border-indigo-500 text-gray-300"
											bind:value={playerq}
											placeholder="Search User"
											required
										/>
									</div>
								</div>
								<div slot="content">
									<div class="overflow-y-auto overflow-x-hidden max-h-64 py-8">
										<ul role="list" class="-my-4 text-sm">
											{#each filteredMembers as person}
												<li class="py-3 px-8 rounded-md">
													<div class="flex justify-between items-center">
														{person.name}
														{person.id}
														{JSON.stringify(playerIdsTmp)}
														<div class="flex gap-2">
															<button
																on:click={() => {
																	handleAddPlayer(person);
																}}
																type="button"
																class={classNames(
																	playerIdsTmp.has(person.id) ? 'bg-green-700' : '',
																	'ring-1 ring-green-700 p-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant min-w-[100px]'
																)}
															>
																Select{playerIdsTmp.has(person.id) ? 'ed' : ''}
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
												playerIds = playerIdsTmp;
												players = playersTmp;
												openModal = false;
											}}
											class="p-2 bg-blue-500 w-full rounded-md text-sm disabled:bg-blue-300"
											type="button"
											disabled={playersTmp.length < 2}
										>
											Add Players
										</button>
									</div>
								</div>
							</Modal>
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
							href={`/matches/${selectedId}`}
							class="block px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-0">View Series</a
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

<style>
	input {
		color-scheme: dark;
	}
</style>
