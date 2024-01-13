<script lang="ts">
	import Counter from '../../components/General/Counter.svelte';
	import { navbarStore } from '../../stores/navbar';
	import type { NavValue } from '../../types';

	// import { seriesStore } from '../../stores/series';

	// const colors = ['red', 'orange', 'yellow'];

	// let active = '';

	// let navValue = { matches: [''] };

	// const unsubscribe = seriesStore.subscribe((value) => {
	// 	navValue = value;
	// });
	let samAttempt = 0;

	function init() {
		navbarStore.update((current: NavValue) => ({
			...current,
			title: 'Scoring',
			buttonAction: () => {
				// showSidePanel = true;
			},
			breadcrumbs: [{ href: '#', label: 'test' }]
		}));
	}
	init();
</script>

<div class="flex items-center">
	<button
		class="w-4 h-4"
		on:click={() => (samAttempt -= 1)}
		aria-label="Decrease the counter by one"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			class="nz sb"
		>
			<path d="M5 10a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5H5.75A.75.75 0 015 10z"></path>
		</svg>
	</button>
	<Counter bind:count={samAttempt} />
	<button
		class="w-4 h-4"
		on:click={() => (samAttempt += 1)}
		aria-label="Increase the counter by one"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
			class="nz sb"
			><path
				d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
			></path></svg
		>
	</button>
</div>
