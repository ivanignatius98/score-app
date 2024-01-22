<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ActionButton from './ActionButton.svelte';
	const dispatch = createEventDispatcher();

	interface itemProps {
		team: string;
		action: string;
	}
	export let actionValue = '2';

	const handleClick = (payload: itemProps) => {
		// Dispatch the event with the correct properties
		dispatch('click', payload);
	};
</script>

<div class="flex justify-evenly gap-3 items-center mb-5">
	<ActionButton
		color="green"
		label={`+${actionValue}`}
		on:click={() => handleClick({ team: 'a', action: `+${actionValue}` })}
	/>
	<ActionButton
		color="red"
		label={actionValue}
		on:click={() => handleClick({ team: 'a', action: `/${actionValue}` })}
	/>
	-
	<ActionButton
		color="green"
		label={`+${actionValue}`}
		on:click={() => handleClick({ team: 'b', action: `+${actionValue}` })}
	/>
	<ActionButton
		color="red"
		label={actionValue}
		on:click={() => handleClick({ team: 'b', action: `/${actionValue}` })}
	/>
</div>
