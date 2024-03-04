<script lang="ts">
	import '../../app.css';
	import Navbar from '../Navbar.svelte';

	import { getInitials } from '../../helpers/general.js';
	import { page } from '$app/stores';
	const classNames = (...classes: string[]) => {
		return classes.filter(Boolean).join(' ');
	};

	export let data;

	const { user } = data;
	let groups = [...user.groupIds, user] || [];

	let currGroupId: string | null = null;

	$: queryParams = $page.url.searchParams;
	$: if (queryParams.get('group')) {
		currGroupId = queryParams.get('group');
	} else {
		if (user.groupIds) {
			currGroupId = user.groupIds[0]._id;
		} else {
			currGroupId = user._id;
		}
	}
</script>

<div class="app bg-gray-900 text-white">
	<div class="flex">
		<div class="w-20 bg-gray-950 h-screen flex flex-col">
			<div class="flex-1 flex flex-col pt-3 pb-4 items-center">
				<nav class="mt-1 px-2 space-y-2">
					<ul role="list" class="gap-y-7 flex flex-col flex-1">
						<li>
							<div class="text-xs text-center">Groups</div>
							<ul role="list" class="mt-3">
								{#each groups as item}
									<li class="mt-2 group first:mt-0 relative">
										<a href={`/?group=${item._id}`}>
											<span
												class={classNames(
													item._id == currGroupId
														? 'bg-indigo-600 text-white rounded-md '
														: 'text-gray-300  hover:text-white',
													'ring-1 bg-gray-800 hover:bg-indigo-600 w-12 h-12 transition-all duration-300 ease-in-out rounded-[48px] group-hover:rounded-md flex justify-center items-center font-semibold'
												)}
											>
												{getInitials(item.name)[0]}
											</span>
										</a>
										<div
											class="z-50 min-w-[120px] opacity-0 bg-gray-800 text-white text-sm rounded-md py-2 px-4 absolute top-1/2 left-16 transform -translate-y-1/2 transition-opacity duration-300 ease-in-out pointer-events-none group-hover:opacity-100"
										>
											{item.name}
										</div>
									</li>
								{/each}
								<li class="mt-2 group relative">
									<a
										href={`#`}
										class={classNames(
											'text-gray-300  hover:text-white group flex items-center text-sm font-medium rounded-md'
										)}
									>
										<div
											class="inline-flex h-12 w-12 transition-all duration-300 ease-in-out rounded-[48px] group-hover:rounded-md items-center justify-center bg-gray-800 text-indigo-600 group-hover:text-white group-hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										>
											<span class="sr-only">Add a new Group</span>
											<svg
												class="w-6 h-6"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												aria-hidden="true"
												><path
													d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"
												></path></svg
											>
										</div>
										<div
											class="z-50 min-w-[120px] opacity-0 bg-gray-800 text-white text-sm rounded-md py-2 px-4 absolute top-1/2 left-16 transform -translate-y-1/2 transition-opacity duration-300 ease-in-out pointer-events-none group-hover:opacity-100"
										>
											Add a new Group
										</div>
									</a>
								</li>
							</ul>
						</li>
					</ul>
				</nav>
			</div>

			<div class="flex-shrink-0 flex p-4">
				<a href="#" class="flex-shrink-0 w-full block">
					<div
						class="text-gray-300 hover:text-white ring-1 bg-indigo-600 w-12 h-12 transition-all duration-300 ease-in-out rounded-[48px] flex justify-center items-center font-semibold"
					>
						{getInitials(user.name)[0]}
					</div>
					<p class="text-xs font-medium text-gray-300 group-hover:text-gray-200 text-center mt-2">
						You
					</p>
				</a>
			</div>
		</div>
		<div class="flex-1">
			<main>
				<Navbar />
				<slot />
			</main>
		</div>
	</div>
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
