<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ActionButton from './ActionButton.svelte';
	import type { Action } from '../../../types';
	const dispatch = createEventDispatcher();

	export let actionValue = '2';

	const handleClick = (payload: { team: string; action: Action }) => {
		// Dispatch the event with the correct properties
		dispatch('click', payload);
	};
</script>

<div class="flex justify-evenly gap-3 items-center mb-5">
	<ActionButton
		color="green"
		label={`+${actionValue}`}
		on:click={() => handleClick({ team: 'a', action: { made: true, value: actionValue } })}
	/>
	<ActionButton
		color="red"
		label={actionValue}
		on:click={() => handleClick({ team: 'a', action: { made: false, value: actionValue } })}
	/>
	-
	<ActionButton
		color="green"
		label={`+${actionValue}`}
		on:click={() => handleClick({ team: 'b', action: { made: true, value: actionValue } })}
	/>
	<ActionButton
		color="red"
		label={actionValue}
		on:click={() => handleClick({ team: 'b', action: { made: false, value: actionValue } })}
	/>
</div>
