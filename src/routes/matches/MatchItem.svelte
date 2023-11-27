<script>
	import Dropdown from '../../components/General/Dropdown.svelte';
	let showDropdown = false;

	export let admin = true;
	export let match = { name: '' };
</script>

<div class="flex items-center space-x-4 relative p-4 rounded-md" class:hover:bg-gray-800={!admin}>
	{#if !admin}
		<button type="button" on:click={() => console.log('TEST')}>
			<span class="absolute bottom-0 -top-[1px] left-0 right-0"> </span>
		</button>
	{/if}
	<div class="flex-1 min-w-0">
		<p class="text-sm font-medium text-white">
			{match.name}
			<span
				class="bg-green-500 bg-opacity-10 text-green-500 text-opacity-100 ring-1 ring-green-500 ring-opacity-20 ring-inset ml-3 inline-block py-1 px-2 text-xs font-medium rounded-md"
			>
				Complete
			</span>
		</p>
		<p class="text-xs text-gray-500 truncate mt-2">Created on March 17, 2023</p>
	</div>
	{#if admin}
		<Dropdown bind:showDropdown>
			<button
				class="flex-shrink-0 hover:bg-gray-800 p-2 rounded-md"
				slot="button-activator"
				id="menu-button"
				aria-expanded="true"
				aria-haspopup="true"
				on:click={() => {
					showDropdown = !showDropdown;
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					class="w-5 h-5"
					><path
						d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z"
					></path></svg
				>
			</button>
			<div slot="dropdown-items" class="p-2" role="none">
				<button
					type="button"
					class=" text-gray-400 hover:bg-indigo-600 hover:text-white block px-4 py-2 text-sm rounded-md w-full text-left"
					role="menuitem"
				>
					View
				</button>
				<button
					type="button"
					class=" text-gray-400 hover:bg-indigo-600 hover:text-white block px-4 py-2 text-sm rounded-md w-full text-left"
					role="menuitem"
				>
					View 2
				</button>
			</div>
		</Dropdown>
	{:else}
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
	{/if}
</div>
