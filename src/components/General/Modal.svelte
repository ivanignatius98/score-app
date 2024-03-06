<script>
	import { clickOutside } from '../../helpers/click_outside';

	export let openModal = false;
	export let title = '';
	export let description = '';
</script>

{#if openModal}
	<div class="z-50 fixed w-full h-full top-0 left-0 flex items-center justify-center">
		<div class="fixed w-full h-full bg-gray-900 opacity-50"></div>
		<div
			class="bg-gray-800 w-full max-w-md md:max-w-xl overflow-auto rounded-md shadow-xl z-50"
			use:clickOutside
			on:outclick={() => (openModal = false)}
		>
			<div class="px-4 sm:px-6 p-3 shadow-xl">
				<div class="flex items-start justify-between">
					<h2 class="text-md font-medium text-white pt-2">{title}</h2>
					<div class="ml-3 flex h-7 items-center">
						<button
							class=" font-bold text-gray-400 hover:text-gray-500 w-6 h-6 relative"
							on:click={() => (openModal = false)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="1.5"
								stroke="currentColor"
								aria-hidden="true"
								class="oc se"
								><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"
								></path></svg
							>
						</button>
					</div>
				</div>
				<div class="mt-1">
					<p class="text-sm text-indigo-300">
						{description}
					</p>
				</div>
				<slot name="header" />
			</div>
			<slot name="content" />
		</div>
	</div>
{/if}
