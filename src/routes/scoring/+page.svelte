<script>
	import Counter from '../../components/General/Counter.svelte';

	// import { seriesStore } from '../../stores/series';

	// const colors = ['red', 'orange', 'yellow'];

	// let active = '';

	// let navValue = { matches: [''] };

	// const unsubscribe = seriesStore.subscribe((value) => {
	// 	navValue = value;
	// });
	let samAttempt = 0;
	let samMake = 0;
	let yerielAttempt = 0;
	let yerielMake = 0;
	let ivanAttempt = 0;
	let ivanMake = 0;
	let samAttempt3 = 0;
	let samMake3 = 0;
	let yerielAttempt3 = 0;
	let yerielMake3 = 0;
	let ivanAttempt3 = 0;
	let ivanMake3 = 0;
</script>

<!-- <div class="my-4">
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
</div> -->
<Counter />
<div class="my-4">
	Yeriel FG: {yerielMake}/{yerielAttempt} - 3PT: {yerielMake3}/{yerielAttempt3}
	<div class="flex gap-4">
		<button
			on:click={() => {
				yerielAttempt++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]"
		>
			2PT NOP
		</button>
		<button
			on:click={() => {
				yerielAttempt++;
				yerielMake++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]"
		>
			2PT MAKE
		</button>
	</div>
	<div class="flex gap-4">
		<button
			on:click={() => {
				yerielAttempt3++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]"
		>
			3PT NOP
		</button>
		<button
			on:click={() => {
				yerielAttempt3++;
				yerielMake3++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]"
		>
			3PT MAKE
		</button>
	</div>
</div>
<div class="my-4">
	Sam FG: {samMake}/{samAttempt} - 3PT: {samMake3}/{samAttempt3}
	<div class="flex gap-4">
		<button
			on:click={() => {
				samAttempt++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]"
		>
			2PT NOP
		</button>
		<button
			on:click={() => {
				samAttempt++;
				samMake++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]"
		>
			2PT MAKE
		</button>
	</div>
	<div class="flex gap-4">
		<button
			on:click={() => {
				samAttempt3++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]"
		>
			3PT NOP
		</button>
		<button
			on:click={() => {
				samAttempt3++;
				samMake3++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]"
		>
			3PT MAKE
		</button>
	</div>
</div>
<div class="my-4">
	Ivan FG: {ivanMake}/{ivanAttempt} - 3PT: {ivanMake3}/{ivanAttempt3}
	<div class="flex gap-4">
		<button
			on:click={() => {
				ivanAttempt++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]"
		>
			2PT NOP
		</button>
		<button
			on:click={() => {
				ivanAttempt++;
				ivanMake++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]"
		>
			2PT MAKE
		</button>
	</div>
	<div class="flex gap-4">
		<button
			on:click={() => {
				ivanAttempt3++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-red-600 min-h-[4.8rem]"
		>
			3PT NOP
		</button>
		<button
			on:click={() => {
				ivanAttempt3++;
				ivanMake3++;
			}}
			class="flex-1 mt-4 rounded-md shadow-lg font-bold bg-emerald-600 min-h-[4.8rem]"
		>
			3PT MAKE
		</button>
	</div>
</div>

<style>
</style>
