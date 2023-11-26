<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let showSidePanel: boolean;
	let width;
</script>

{#if showSidePanel}
	<aside class="relative z-10">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" transition:fade />
		<div class="fixed inset-0 overflow-hidden">
			<div class="absolute inset-0 overflow-hidden">
				<div class="absolute inset-y-0 right-0 flex max-w-full pl-10">
					<div class="my-auto h-full w-screen max-w-2xl">
						<div
							bind:clientWidth={width}
							transition:fly={{ x: width }}
							class="m-auto flex h-full flex-col overflow-y-scroll bg-gray-900 py-6 shadow-xl"
						>
							<div class="px-4 sm:px-6">
								<div class="flex items-start justify-between">
									<h2 class="text-lg font-medium text-white">Panel title</h2>
									<div class="ml-3 flex h-7 items-center">
										<button
											class="rounded-md bg-gray-900 font-bold text-gray-400 hover:text-gray-500 w-6 h-6 relative"
											on:click={() => (showSidePanel = false)}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												stroke-width="1.5"
												stroke="currentColor"
												aria-hidden="true"
												class="oc se"
												><path
													stroke-linecap="round"
													stroke-linejoin="round"
													d="M6 18L18 6M6 6l12 12"
												></path></svg
											>
										</button>
									</div>
								</div>
							</div>
							<div class="relative mt-6 flex-1 px-4 sm:px-6">
								<div class="absolute inset-0 px-4 sm:px-6">
									<div class="h-full border-2 border-dashed border-gray-200" aria-hidden="true">
										Some content
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</aside>
{/if}
