<script>
	let active = false;
</script>

<div class="grid grid-cols-3 gap-4">
	<button class="ring-1 ring-blue-600 rounded-sm" class:active={active} on:click={() => (active = !active)}> foo </button>
	<button class="ring-1 ring-blue-600 rounded-sm" on:click={() => (active = !active)}
		>bar</button
	>
	<button class="ring-1 ring-blue-600 rounded-sm" on:click={() => (active = !active)}
		>foo</button
	>
	<button class="ring-1 ring-blue-600 rounded-sm" on:click={() => (active = !active)}
		>foo</button
	>
	<button class="ring-1 ring-blue-600 rounded-sm" on:click={() => (active = !active)}
		>foo</button
	>
</div>

<style>
	.active {
		background-color: pink;
	}
</style>
