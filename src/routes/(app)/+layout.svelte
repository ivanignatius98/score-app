<script lang="ts">
	import '../../app.css';
	import Navbar from '../Navbar.svelte';
	import { fly, fade } from 'svelte/transition';
	import { clickOutside } from '../../helpers/click_outside';

	import { getInitials } from '../../helpers/general.js';
	export let sidebarOpen = true;
	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};

	export let data;

	// If returning from different website, runs once (as it's an SPA) to restore user session if session cookie is still valid
	const { user } = data;
	let groups = [...user.groupIds, user] || [];
</script>

<div class="app bg-gray-900 text-white overflow-hidden">
	<div class="flex w-64 flex-col fixed inset-y-0 z-50 bg-gray-900">
		<div class="flex-1 flex flex-col min-h-0">
			<div class="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
				<div class="flex items-center flex-shrink-0 px-4">
					<img
						class="h-8 w-auto"
						src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
						alt="Workflow"
					/>
				</div>
				<nav class="mt-5 px-2 space-y-1">
					<ul role="list" class="gap-y-7 flex flex-col flex-1">
						<!-- <li>
							<ul role="list">
								{#each navigation as item}
									<li class="mt-1 first:mt-0">
										<a
											href={item.href}
											class={classNames(
												item.current
													? 'bg-indigo-800 text-white'
													: 'text-gray-300 hover:bg-indigo-800 hover:text-white',
												'group flex items-center px-2 py-3 text-sm font-medium rounded-md'
											)}
										>
											{item.name}
										</a>
									</li>
								{/each}
							</ul>
						</li> -->
						<li>
							<div class="text-xs">Groups</div>
							<ul role="list" class="mt-3">
								{#each groups as item}
									<li class="mt-1 group first:mt-0">
										<a
											href={`/?group=${item._id}`}
											class={classNames(
												item.current
													? 'bg-indigo-800 text-white'
													: 'text-gray-300 hover:bg-indigo-800 hover:text-white',
												' flex items-center px-2 py-3 text-sm font-medium rounded-md  transition-all duration-300 ease-in-out'
											)}
										>
											<span
												class="ring-1 w-6 h-6 bg-indigo-500 transition-all duration-300 ease-in-out rounded-[48px] group-hover:rounded-md flex justify-center items-center mr-2"
											>
												{getInitials(item.name)[0]}
											</span>
											{item.name}
										</a>
										<!-- <div class="group">
											<div class="w-40 h-40 bg-gray-500 transition-all duration-1000 ease-in-out group-hover:rounded-lg rounded-full"></div>
										</div> -->
									</li>
								{/each}
								<li class="mt-1">
									<a
										href={`#`}
										class={classNames(
											'text-gray-300 hover:bg-indigo-800 hover:text-white group flex items-center px-2 py-3 text-sm font-medium rounded-md'
										)}
									>
										<div
											class="inline-flex h-6 w-6 transition-all duration-300 ease-in-out rounded-[48px] group-hover:rounded-md flex-shrink-0 mr-2 items-center justify-center bg-gray-800 text-indigo-600 group-hover:text-white group-hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											<span class="sr-only">Add a new Group</span>
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
										</div>
										Add a new Group
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</nav>
			</div>
			<div class="flex-shrink-0 flex p-4">
				<a href="#" class="flex-shrink-0 w-full group block">
					<div class="flex items-center">
						<div class="ml-3">
							<p class="text-sm font-medium text-white">{user.name}</p>
							<p class="text-xs font-medium text-gray-300 group-hover:text-gray-200">
								View profile
							</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>

	<main>
		<Navbar />
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
