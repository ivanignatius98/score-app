<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DropdownMenu from './DropdownMenu.svelte';
	const dispatch = createEventDispatcher();
	export let item: any | null = null;
	interface DropdownItem {
		label: string;
		link: string;
	}
	const items: DropdownItem[] = [
		{ label: 'Option 1', link: '/option1' },
		{ label: 'Option 2', link: '/option2' },
		{ label: 'Option 3', link: '/option3' }
	];
</script>

{#if item != null}
	<div class="flex items-center space-x-4 relative p-4 rounded-md hover:bg-gray-800">
		<button type="button" on:click={() => dispatch('itemClicked', item)}>
			<span class="absolute bottom-0 -top-[1px] left-0 right-0"> </span>
		</button>
		<div class="flex-1 min-w-0">
			<p class="text-sm font-medium text-white">
				{item.name}

				<slot name="additional-view" />
			</p>
			<p class="text-xs text-gray-500 truncate mt-2">{item.desc}</p>
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

		<DropdownMenu {items} direction="up" />
	</div>
{/if}
