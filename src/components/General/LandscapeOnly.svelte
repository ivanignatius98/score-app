<script>
	import { onMount } from 'svelte';

	// let landscapeMode = false;
	let showPrompt = false;

	onMount(() => {
		const handleOrientation = () => {
			showPrompt = window.innerWidth < 512 && window.innerWidth < window.innerHeight;
			// showPrompt = !landscapeMode && isMobile();
		};

		// const isMobile = () => {
		//   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
		// };

		window.addEventListener('resize', handleOrientation);
		handleOrientation();

		return () => {
			window.removeEventListener('resize', handleOrientation);
		};
	});
</script>

{#if showPrompt}
	<div class="landscape-prompt">
		<div>
			<h2>Please rotate your device to landscape mode</h2>
		</div>
	</div>
{:else}
	<slot />
{/if}

<style>
	.landscape-prompt {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
	}
</style>
