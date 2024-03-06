<script>
	import { clickOutside } from '../../helpers/click_outside.ts';
	export let showDropdown = false;

	import { fade } from 'svelte/transition';
</script>

<div
	class="relative inline-block text-left"
	use:clickOutside
	on:outclick={() => (showDropdown = false)}
>
	<slot name="button-activator" />
	{#if showDropdown}
		<div
			class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-black shadow-lg"
			transition:fade={{ duration: 150 }}
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<slot name="dropdown-items" />
		</div>
	{/if}
</div>
