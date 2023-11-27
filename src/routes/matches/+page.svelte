<script>
	import SlideOver from '../../components/General/SlideOver.svelte';
	import { clickOutside } from '../../helpers/click_outside.ts';

	export let data;
	$: ({ record } = data);
	let showSidePanel = false;
	let showDropdown = false;
</script>

<div
	class="relative inline-block text-left"
	use:clickOutside
	on:outclick={() => (showDropdown = false)}
>
	<div>
		<button
			on:click={() => {
				showDropdown = !showDropdown;
			}}
			type="button"
			class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			Options
			<svg
				class="-mr-1 h-5 w-5 text-gray-400"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
	</div>

	{#if showDropdown}
		<div
			class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div class="py-1" role="none">
				<!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
				<a
					href="#"
					class="text-gray-700 block px-4 py-2 text-sm"
					role="menuitem"
					tabindex="-1"
					id="menu-item-0">Account settings</a
				>
				<a
					href="#"
					class="text-gray-700 block px-4 py-2 text-sm"
					role="menuitem"
					tabindex="-1"
					id="menu-item-1">Support</a
				>
				<a
					href="#"
					class="text-gray-700 block px-4 py-2 text-sm"
					role="menuitem"
					tabindex="-1"
					id="menu-item-2">License</a
				>
				<form method="POST" action="#" role="none">
					<button
						type="submit"
						class="text-gray-700 block w-full px-4 py-2 text-left text-sm"
						role="menuitem"
						tabindex="-1"
						id="menu-item-3">Sign out</button
					>
				</form>
			</div>
		</div>
	{/if}
</div>

<div class="flow-root mt-6">
	<ul role="list" class="-my-5 divide-y divide-gray-800">
		{#each record as person}
			<li>
				<div class="flex items-center space-x-4 relative py-4">
					<button type="button" on:click={() => console.log('TEST')}>
						<span class="absolute bottom-0 -top-[1px] left-0 right-0"> </span>
					</button>
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
<button class="p-3" on:click={() => (showSidePanel = true)}> Show side panel </button>

<SlideOver bind:showSidePanel></SlideOver>
