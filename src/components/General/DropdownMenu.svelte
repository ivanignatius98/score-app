<script lang="ts">
	interface DropdownItem {
		label: string;
		link: string;
	}
	export let items: DropdownItem[] = [];
	export let direction: 'down' | 'up' = 'down';

	let isOpen = false;

	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

<div class="dropdown">
	<button on:click={toggleDropdown} class="text-gray-600 hover:text-gray-800 focus:outline-none">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
			/>
		</svg>
	</button>
	{#if isOpen}
		<ul
			class="absolute z-10 list-none m-0 p-0 bg-gray-700 min-w-[6rem]"
			class:down={direction === 'down'}
			class:up={direction === 'up'}
		>
			{#each items as item}
				<li><a href={item.link}>{item.label}</a></li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.dropdown {
		position: relative;
		display: inline-block;
	}

	.down {
		top: 100%;
		right: 0;
	}

	.up {
		bottom: 100%;
		right: 0;
	}

	.dropdown-menu li a {
		color: #333;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}

	.dropdown-menu li a:hover {
		background-color: #f1f1f1;
	}
</style>
