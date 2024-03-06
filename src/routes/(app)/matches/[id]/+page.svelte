<script lang="ts">
	import { enhance } from '$app/forms';
	import Modal from '../../../../components/General/Modal.svelte';
	import SlideOver from '../../../../components/General/SlideOver.svelte';
	import ListItem from '../../../../components/General/ListItem.svelte';
	import { getInitials } from '../../../../helpers/general.js';
	import { navbarStore } from '../../../../stores/navbar.ts';
	import type { Match, NavValue, Player, StatSummary } from '../../../../types';
	import { Types } from 'mongoose';
	import Dropdown from '../../../../components/General/Dropdown.svelte';
	import { matchSummary } from '../../../../services/series/index.ts';
	import { goto } from '$app/navigation';
	import ScoreTable from '../../../../components/Scoring/ScoreTable.svelte';

	export let data;
	let number = -1;
	let selectedId: string = '';
	let isLoading = false;
	let showDropdown = false;

	let matches: (Match & { _id?: string })[] = [];
	let players: Player[] = [];
	let playerMap = new Map();
	let showSidePanel = false;
	let seriesId: string = '';
	let summary: Promise<{ success: boolean; record: StatSummary[] }> | null = null;
	let showSummaryModal = false;

	function init() {
		navbarStore.update((current: NavValue) => ({
			...current,
			title: 'Matches',
			buttons: [
				{
					label: 'Edit',
					action: () => {
						showSidePanel = true;
					}
				},
				{
					label: 'Summary',
					action: () => {
						handleGetSummary(seriesId);
					}
				},
				{
					label: 'Create',
					primary: true,
					action: () => {
						showSidePanel = true;
					}
				}
			],
			breadcrumbs: [{ href: '#', label: 'Series' }],
			backButton: { action: () => goto('/'), label: 'Back' }
		}));

		matches = data.matches || [];
		players = data.players || [];
		playerMap = data.playersMap || new Map();
		seriesId = data.series_id ?? '';
	}
	init();

	const handleGetSummary = (val: string) => {
		showSummaryModal = true;
		summary = matchSummary(val);
	};
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
			number = matches.length + 1;
			selectedId = '';
			showDropdown = false;
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
		number = detail.number;
	};
	//#endregion
</script>

<div class="flow-root my-6">
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each matches as match}
			<li>
				<ListItem
					item={{
						...match,
						name: `Match ${match.number}`,
						desc: new Date(match.createdAt).toDateString()
					}}
					on:itemClicked={handleItemClicked}
				>
					<span slot="additional-view">
						<span
							class={classNames(
								' bg-opacity-10  text-opacity-100 ring-1  ring-opacity-20 ring-inset ml-3 inline-block py-1 px-2 text-xs font-medium rounded-md',
								match.status == 'archived'
									? 'bg-green-500 text-green-500 ring-green-500'
									: 'bg-yellow-500 text-yellow-500 ring-yellow-500'
							)}
						>
							{match.status}
						</span>
					</span>
				</ListItem>
			</li>
		{/each}
	</ul>
</div>
<!-- <div class="mt-6">
	<button
		type="button"
		on:click={() => {
		}}
		class="w-full flex justify-center items-center px-4 py-2 shadow-sm text-sm font-medium rounded-md text-white bg-white bg-opacity-10 hover:bg-opacity-20"
	>
		View all
	</button>
</div> -->
<Modal bind:openModal={showSummaryModal} title="Series Summary">
	<div slot="content">
		<div class="min-h-[240px] overflow-x-auto">
			{#await summary}
				<div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
					<svg
						aria-hidden="true"
						class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
				</div>
			{:then value}
				{#if value && value.success && value?.record}
					<ScoreTable data={value.record} />
				{/if}
			{/await}
		</div>
	</div>
</Modal>
<SlideOver bind:showSidePanel title={`${selectedId ? 'Update' : 'Create New'}  Match`}>
	<form
		method="post"
		action="?/store"
		use:enhance={({ formData, formElement, cancel }) => {
			// Before form submission to server
			// Optimistic UI
			const number = Number(formData.get('number'));
			const arrA = [...teamAIds];
			const arrB = [...teamBIds];
			const aIds = arrA.map((row) => new Types.ObjectId(row));
			const bIds = arrB.map((row) => new Types.ObjectId(row));

			const newMatchToSave = {
				_id: '',
				number,
				status: 'live',
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
				newMatchItem.status = matches[index].status;
				newMatchToSave.status = matches[index].status;
				newMatchToSave._id = selectedId || '';
				newMatchItem._id = selectedId || '';
				// Create a new array with the updated item
				const newArray = [...matches];
				newArray[index] = { ...newArray[index], ...newMatchItem };
				matches = newArray;
			}
			formData.append('data', JSON.stringify(newMatchToSave));

			isLoading = true;
			return async ({ update, result }) => {
				let redir = '';
				if (result.status == 200 && result.type == 'success') {
					if (result.data && Array.isArray(result.data.records)) {
						matches = result.data.records;
						if (typeof result.data.newId === 'string') redir = result.data.newId;
					}
				}
				await update();
				isLoading = false;
				showSidePanel = false;

				if (redir) goto('/scoring/' + redir);
			};
		}}
		slot="content"
		class="flex flex-1 flex-col justify-between h-full"
	>
		<div class="divide-y divide-gray-200 px-4 sm:px-6 overflow-y-auto">
			<div class="space-y-6">
				<div>
					<input name="series_id" type="hidden" bind:value={seriesId} />
					<label for="number" class="block mb-2 text-sm text-white">Match Number</label>
					<div class="flex">
						<div
							class="flex rounded-md shadow-sm border border-gray-800 bg-gray-800 focus-within:border-indigo-600"
						>
							<span class="inline-flex items-center pl-3 rounded-l-md text-gray-500 text-sm">
								Match
							</span>
							<input
								type="number"
								name="number"
								bind:value={number}
								class="w-10 text-sm rounded-r-md block py-2 px-2 bg-gray-800 text-gray-400 focus:outline-none"
								placeholder="1"
								required
							/>
						</div>
					</div>
				</div>
				<Modal title="Assign Teams" bind:openModal>
					<div slot="content">
						<div class="overflow-y-auto overflow-x-hidden max-h-80">
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
				<div class="text-sm">
					<h3 class="font-medium">Team A Members</h3>
					<div class="mt-2">
						<ul role="list">
							{#each teamA as person}
								<li
									class="box-border border-[1px] first:border-b-0 border-x-0 border-solid border-gray-700 py-3"
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
												handleAddTeam('a', person);
											}}
										>
											Remove
										</button>
									</div>
								</li>
							{/each}
						</ul>
					</div>
				</div>
				<div class="text-sm">
					<h3 class="font-medium">Team B Members</h3>
					<div class="mt-2">
						<ul role="list">
							{#each teamB as person}
								<li
									class="box-border border-[1px] first:border-b-0 last:border-t-0 border-x-0 border-solid border-gray-700 py-3"
								>
									<div class="flex items-center">
										<div class="flex-grow">
											<span
												class="bg-red-500 group-hover:bg-red-700 inline-flex items-center justify-center h-8 w-8 rounded-full mr-2"
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
												handleAddTeam('b', person);
											}}
										>
											Remove
										</button>
									</div>
								</li>
							{/each}
							<li
								class=" box-border border-[1px] first:border-b-0 last:border-t-0 border-x-0 border-solid border-gray-700 py-3"
							>
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
									<span class="text-sm font-medium group-hover:opacity-90 text-indigo-400">Add</span
									>
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<div class="flex flex-shrink-0 p-4 gap-3 items-center">
			<button
				disabled={isLoading}
				type="submit"
				class="flex-1 disabled:bg-indigo-300 justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
			>
				Save and Score
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
						<!-- <a
							href={`/scoring/${selectedId}`}
							class="block px-4 py-2 text-sm hover:bg-gray-700 rounded-t-lg"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-0">View Score</a
						> -->

						<button
							disabled={true}
							formaction="?/delete"
							class="w-full px-4 py-2 text-sm bg-red-800 hover:bg-red-700 rounded-lg text-left disabled:bg-red-300"
							>Delete</button
						>
					</div>
				</Dropdown>
			{/if}
		</div>
	</form>
</SlideOver>

<style>
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
	}
</style>
