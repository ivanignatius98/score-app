<script>
	import { fly, fade } from 'svelte/transition';
	import { clickOutside } from '../../helpers/click_outside';
	export let showSidePanel = false;
	export let title = '';
	let width;
</script>

{#if showSidePanel}
	<aside class="relative z-10">
		<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" transition:fade />
		<div class="fixed inset-0 overflow-hidden">
			<div class="absolute inset-0 overflow-hidden">
				<div class="absolute inset-y-0 right-0 flex max-w-full">
					<div class="my-auto h-full w-screen max-w-xl pl-20">
						<div
							use:clickOutside
							on:outclick={() => (showSidePanel = false)}
							bind:clientWidth={width}
							transition:fly={{ x: width }}
							class="m-auto flex h-full flex-col overflow-y-auto bg-gray-900 shadow-xl"
						>
							<div class="bg-indigo-700">
								<div class="px-4 sm:px-6 py-6 mt-1">
									<div class="flex items-start justify-between ">
										<h2 class="text-lg font-medium text-white">{title}</h2>
										<div class="ml-3 flex h-7 items-center">
											<button
												class="rounded-md font-bold text-gray-400 hover:text-gray-500 w-7 h-7 relative"
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
									<div class="mt-1">
										<p class="text-sm text-indigo-300">
											Get started by filling in the information below to create your new project.
										</p>
									</div>
								</div>
							</div>
							<div class="relative mt-6 flex-1 px-4 sm:px-6">
								<div class="absolute inset-0 px-4 sm:px-6">
									<div class="h-full">
										<slot name="content" />
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
