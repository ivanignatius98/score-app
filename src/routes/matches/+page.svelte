<script>
	import SlideOver from '../../components/General/SlideOver.svelte';
	import MatchItem from './MatchItem.svelte';

	export let data;
	$: ({ record } = data);
	let showSidePanel = false;
	let admin = false;
</script>

<div class="flow-root mt-6">
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each record as match}
			<li>
				<MatchItem bind:match bind:admin />
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
<button class="p-3" on:click={() => (showSidePanel = true)}> Show side panel </button>

<SlideOver bind:showSidePanel></SlideOver>
