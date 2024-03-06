<script lang="ts">
	import Dropdown from '../../components/General/Dropdown.svelte';
	import Modal from '../../components/General/Modal.svelte';
	import ScoreTable from '../../components/Scoring/ScoreTable.svelte';
	import { matchSummary } from '../../services/series';
	import type { Series, StatSummary } from '../../types';

	export let row: Series & { _id?: string };

	let showDropdown = false;

	let summary: Promise<{ success: boolean; record: StatSummary[] }> | null = null;
	let showSummaryModal = false;

	const handleGetSummary = (val: string) => {
		showSummaryModal = true;
		summary = matchSummary(val);
	};
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
</script>

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
<div class="flex items-center space-x-4 relative p-4 rounded-md">
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium text-white">
			{row.name}
		</p>
		<p class="text-xs text-gray-500 truncate mt-2">{new Date(row.date).toDateString()}</p>
	</div>
	<span class="flex items-center gap-4">
		<Dropdown bind:showDropdown>
			<button
				slot="button-activator"
				on:click={() => (showDropdown = !showDropdown)}
				type="button"
				class="h-9 w-9 hover:bg-gray-500 p-2 rounded-full"
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
				class="origin-top-right text-sm absolute z-10 right-0 mt-2 w-32 bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				tabindex="-1"
			>
				<a
					href={`/matches/${row._id}`}
					class="block px-4 py-2 hover:bg-gray-700 rounded-t-lg"
					role="menuitem"
					tabindex="-1"
					id="user-menu-item-0">View Matches</a
				>
				<button
					on:click={() => dispatch('itemClicked', row)}
					class="w-full px-4 py-2 hover:bg-gray-700 text-left">Edit</button
				>
				<button
					on:click={() => {
						if (row._id) {
							handleGetSummary(row._id);
							showDropdown = false;
						}
					}}
					class="w-full px-4 py-2 hover:bg-gray-700 text-left">Summary</button
				>
				<button
					disabled={row.matches.length > 0}
					formaction="?/delete"
					class="w-full px-4 py-2 bg-red-800 hover:bg-red-700 rounded-b-lg text-left disabled:bg-red-300"
					>Delete</button
				>
			</div>
		</Dropdown>
	</span>
</div>
