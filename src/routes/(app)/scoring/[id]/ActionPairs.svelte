<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ActionButton from './ActionButton.svelte';
	import type { Action } from '../../../../types';
	const dispatch = createEventDispatcher();

	export let action = { value: 2, type: 'FG' };

	const handleClick = (payload: { team: string; action: Action }) => {
		// Dispatch the event with the correct properties
		dispatch('click', payload);
	};
</script>

<div class="flex justify-evenly gap-3 items-center mb-5">
	<ActionButton
		color="green"
		label={`+${action.value}`}
		on:click={() =>
			handleClick({ team: 'a', action: { made: true, value: action.value, type: action.type } })}
	/>
	<ActionButton
		color="red"
		label={action.value.toString()}
		on:click={() =>
			handleClick({ team: 'a', action: { made: false, value: action.value, type: action.type } })}
	/>
	-
	<ActionButton
		color="green"
		label={`+${action.value}`}
		on:click={() =>
			handleClick({ team: 'b', action: { made: true, value: action.value, type: action.type } })}
	/>
	<ActionButton
		color="red"
		label={action.value.toString()}
		on:click={() =>
			handleClick({ team: 'b', action: { made: false, value: action.value, type: action.type } })}
	/>
</div>
