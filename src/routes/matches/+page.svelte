<script lang="ts">
	import SlideOver from '../../components/General/SlideOver.svelte';

	export let data: any;
	$: ({ record } = data);
	let showSidePanel = false;
</script>

<div class="flow-root mt-6">
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each record as person}
			<li class="py-4">
				<div class="flex items-center space-x-4">
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-white">
							{person.name}
							<span
								class="bg-green-500 bg-opacity-10 text-green-500 text-opacity-100 ring-1 ring-green-500 ring-opacity-20 ring-inset ml-3 inline-block py-1 px-2 text-xs font-medium rounded-md"
							>
								Complete
							</span>
						</p>
						<p class="text-xs text-gray-500 truncate mt-2">Created on March 17, 2023</p>
					</div>
					<svg
						class="flex-shrink-0 w-1 h-2"
						viewBox="0 0 24 44"
						preserveAspectRatio="none"
						fill="none"
						stroke="currentColor"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
					>
						<path stroke-width="2" d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
					</svg>
				</div>
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
<div>
	<button class="p-3" on:click={() => (showSidePanel = true)}> Show side panel </button>
</div>

<SlideOver bind:showSidePanel></SlideOver>
