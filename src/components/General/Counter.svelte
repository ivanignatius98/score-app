<script lang="ts">
	import { spring } from 'svelte/motion';

	export let count = 0;

	const displayed_count = spring();
	$: displayed_count.set(count);
	$: offset = modulo($displayed_count, 1);

	function modulo(n: number, m: number) {
		// handle negative numbers
		return ((n % m) + m) % m;
	}
</script>

<div class="counter-viewport">
	<div class="counter-digits" style="transform: translate(0, {100 * offset}%)">
		<strong class="hidden" aria-hidden="true">{Math.floor($displayed_count + 1)}</strong>
		<strong>{Math.floor($displayed_count)}</strong>
	</div>
</div>

<style>
	.counter-viewport {
		width: 4rem;
		height: 2rem;
		overflow: hidden;
		text-align: center;
		position: relative;
	}

	.counter-viewport strong {
		position: absolute;
		display: flex;
		width: 100%;
		height: 100%;
		font-weight: 400;
		color: var(--color-theme-1);
		font-size: 2rem;
		align-items: center;
		justify-content: center;
	}

	.counter-digits {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.hidden {
		top: -100%;
		user-select: none;
	}
</style>
