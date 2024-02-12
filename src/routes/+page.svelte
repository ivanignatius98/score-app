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
	import { saveAction } from '../services/user/index.ts';
	import { goto } from '$app/navigation';
	let name = '';
	let seriesDate = '';
	let isLoading = false;

	export let data;

	let series: (Series & { _id?: string })[] = [];
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
			buttons: [
				{
					label: 'Create',
					action: () => {
						showSidePanel = true;
					}
				}
			],
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
		colorClass: string;
	}
	let playersTmp: TeamItem[] = [];
	let playerIdsTmp: Set<Types.ObjectId> = new Set();
	let players: TeamItem[] = [];
	let playerIds: Set<Types.ObjectId> = new Set();

	const handleAddPlayer = async (person: Player, skipTmp?: Boolean) => {
		const stringId = person._id;
		const initials = getInitials(person.name);
		if (playerIdsTmp.has(stringId)) {
			playerIdsTmp.delete(stringId);
			const foundIndex = playersTmp.findIndex((obj) => obj._id === person._id);
			if (foundIndex !== -1) {
				const temp = [...playersTmp];
				temp.splice(foundIndex, 1);
				playersTmp = temp;
				playerIdsTmp = new Set([...playerIdsTmp]);
			}
		} else {
			playerIdsTmp = new Set([...playerIdsTmp, stringId]);
			playersTmp = [...playersTmp, { ...person, initials, colorClass: 'bg-red-500' }];
		}

		if (skipTmp) {
			playerIds = playerIdsTmp;
			players = playersTmp;
		}
	};
	//#endregion

	interface itemProps {
		detail: Series & { _id: string };
	}
	const handleItemClicked = ({ detail }: itemProps) => {
		selectedId = detail._id;
		name = detail.name;
		seriesDate = detail.date ? detail.date.split('T')[0] : formattedDate;
		const ids: Types.ObjectId[] = [];
		players = detail.players.map(({ _id, name }) => {
			ids.push(_id);
			return {
				_id: _id,
				name: name,
				initials: getInitials(name),
				colorClass: 'bg-red-500'
			};
		});
		playerIds = new Set([...ids]);
		playersTmp = [...players];
		playerIdsTmp = new Set([...playerIds]);
		showSidePanel = true;
	};

	const handleAddNewUser = async () => {
		const { success, record } = await saveAction({
			name: playerq
		});
		if (success) {
			playerIds = new Set([record._id, ...playerIdsTmp]);
			players = [
				{
					_id: record._id,
					name: record.name,
					initials: getInitials(record.name),
					colorClass: 'bg-red-500'
				},
				...players
			];
			playerIdsTmp = new Set([...playerIds]);
			playersTmp = [...players];
			members = [record, ...members];
		}
	};
</script>

<div class="flow-root mt-6">
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
		use:enhance={({ formData, cancel }) => {
			const name = String(formData.get('name'));
			const newSeries = {
				_id: selectedId || '',
				name,
				players,
				date: seriesDate,
				createdBy: new Types.ObjectId('6565fcf005ac129c4a659284'),
				createdAt: new Date(),
				updatedAt: new Date(),
				matches: []
			};
			if (selectedId == '') {
				series = [newSeries, ...series];
			} else {
				const index = series.findIndex((item) => item._id === selectedId);
				if (index == -1) {
					cancel();
					return;
				}
				const newArray = [...series];
				newArray[index] = { ...newArray[index], ...newSeries };
				series = newArray;
			}
			formData.append('data', JSON.stringify(newSeries));
			isLoading = true;
			let redir = ""
			return async ({ update, result }) => {
				if (result.status == 200 && result.type == 'success') {
					if (result.data && result.data.records) {
						const temp = [...series];
						temp[0]._id = result.data.records._id;
						series = temp;

						if (selectedId == '') {
							redir = '/matches/' + result.data.records._id
						}
					}
				}
				isLoading = false;
				showSidePanel = false;
				await update();

				if (redir) goto(redir);
			};
		}}
		slot="content"
		class="flex flex-1 flex-col justify-between h-full px-4 sm:px-6"
	>
		<section class="space-y-6">
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
			<h3 class="text-sm font-medium text-white">Players for the day</h3>
		</section>
		<div class="flex-1 divide-y divide-gray-200 overflow-auto">
			<div class="space-y-6 mt-2">
				<ul role="list">
					{#each players as person}
						<li
							class="box-border border-t-[1px] border-solid first:border-0 border-gray-700 py-3 px-2"
						>
							<div class="flex items-center">
								<div class="flex-grow">
									<!-- Content for the first div (takes up max space) -->
									<span
										class="bg-blue-500 group-hover:bg-blue-700 inline-flex items-center justify-center h-8 w-8 rounded-full mr-2"
									>
										<span
											class="text-sm font-medium leading-none text-white group-hover:text-gray-300"
											>{person?.initials}</span
										>
									</span>
									{person?.name}
								</div>
								<button
									class="text-sm font-medium hover:opacity-90 text-indigo-400"
									on:click|preventDefault={() => {
										handleAddPlayer(person, true);
									}}
								>
									Remove
								</button>
							</div>
						</li>
					{/each}
					<li class="box-border border-t-[1px] border-solid border-gray-700 py-3 px-2">
						<button
							class="group flex items-center gap-3"
							on:click={() => (openModal = true)}
							type="button"
						>
							<div
								class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-700 bg-gray-800 text-gray-600 group-hover:border-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
							</div>
							<span class="text-sm font-medium group-hover:opacity-90 text-indigo-400">Add</span>
						</button>
					</li>
				</ul>
			</div>
		</div>

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
				<div class="overflow-y-auto overflow-x-hidden h-64 md:h-72 py-8">
					<ul role="list" class="-my-4 text-sm">
						{#each filteredMembers as person}
							<li class="py-3 px-8 rounded-md">
								<div class="flex justify-between items-center">
									{person.name}
									<div class="flex gap-2">
										<button
											on:click={() => {
												handleAddPlayer(person);
											}}
											type="button"
											class={classNames(
												playerIdsTmp.has(person._id) ? 'bg-green-700' : '',
												'ring-1 ring-green-700 p-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant min-w-[100px]'
											)}
										>
											Select{playerIdsTmp.has(person._id) ? 'ed' : ''}
										</button>
									</div>
								</div>
							</li>
						{/each}
						{#if filteredMembers.length == 0 && playerq != ''}
							<li class="py-3 px-8 rounded-md">
								<div class="flex justify-between items-center">
									Add {playerq} as new User?
									<div class="flex gap-2">
										<button
											on:click={() => handleAddNewUser()}
											type="button"
											class={classNames(
												'ring-1 ring-green-700 p-4 items-center border border-transparent rounded-sm shadow-sm text-white bg-transparant min-w-[100px]'
											)}
										>
											Select
										</button>
									</div>
								</div>
							</li>
						{/if}
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
		<div class="flex flex-shrink-0 p-4 gap-3 items-center">
			<button
				disabled={isLoading}
				type="submit"
				class=" disabled:bg-indigo-300 flex-1 flex items-center justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				{#if isLoading}
					<svg
						aria-hidden="true"
						class="w-5 h-5 mx-2 text-gray-200 animate-spin dark:text-gray-300 fill-blue-300"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						><path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/><path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/></svg
					>
					<span class="sr-only">Loading...</span>
				{/if}
				Save {selectedId ? '' : 'and go to matches'}
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
							disabled={true}
							formaction="?/delete"
							class="w-full px-4 py-2 text-sm bg-red-800 hover:bg-red-700 rounded-b-lg text-left disabled:bg-red-300"
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
