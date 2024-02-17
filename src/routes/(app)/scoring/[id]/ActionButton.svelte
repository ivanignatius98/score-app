<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let color = 'green';
	export let label = '2';

	$: colorclass = color == 'green' ? `ring-green-600 text-green-600` : 'ring-red-600 text-red-600';
</script>

<button
	on:click={() => dispatch('click')}
	type="button"
	class={`${colorclass} flex flex-1 h-14 justify-center font-bold ring-1 py-1 px-4 items-center border border-transparent rounded-sm shadow-sm  bg-transparent`}
>
	{label}
</button>
