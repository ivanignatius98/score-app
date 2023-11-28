<script>
	const colors = ['red', 'orange', 'yellow'];

	let active = '';
</script>

<div class="my-4">
	<label for="shot-type">Shot</label>
	<div id="shot-type" class="grid grid-cols-3 gap-4 mt-2">
		{#each colors as color}
			<button
				class={`${
					active == color ? 'ring-2 ring-green-400' : ''
				} rounded-md p-2 bg-gray-700 md:hover:bg-gray-600`}
				aria-current={active === color}
				aria-label={color}
				class:active={active == color}
				on:click={() => (active = active == color ? '' : color)}
				>{color}
			</button>
		{/each}
	</div>
</div>
<div class="flex gap-4">
	<button class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]">
		NOP
	</button>
	<button class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]">
		MAKE
	</button>
</div>

<style>
</style>
