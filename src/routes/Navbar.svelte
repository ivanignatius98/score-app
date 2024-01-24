<script lang="ts">
	import { goto } from '$app/navigation';
	import { navbarStore } from '../stores/navbar.ts';
	import type { NavValue } from '../types';
	let navValue: NavValue = {
		title: '',
		button: { label: 'Create', action: () => {} },
		breadcrumbs: [],
		backNav: '#'
	};

	navbarStore.subscribe((value) => {
		navValue = value;
	});

	const goBack = () => {
		goto(navValue.backNav);
	};
</script>

<div class="mb-5">
	<div>
		<nav class="" aria-label="Back">
			<button
				on:click={goBack}
				class="flex items-center text-sm font-medium text-gray-400 hover:text-gray-200"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
					class="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-500"
					><path
						fill-rule="evenodd"
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
						clip-rule="evenodd"
					></path></svg
				>
				Back
			</button>
		</nav>
		<!-- <nav class="hidden sm:flex" aria-label="Breadcrumb">
			<ol role="list" class="flex items-center space-x-4">
				{#each navValue.breadcrumbs as row, i}
					{#if i == 0}
						<li>
							<div class="flex">
								<a href={row.href} class="text-sm font-medium text-gray-400 hover:text-gray-200">
									{row.label}
								</a>
							</div>
						</li>
					{:else}
						<li>
							<div class="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true"
									class="flex-shrink-0 h-5 w-5 text-gray-500"
									><path
										fill-rule="evenodd"
										d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
										clip-rule="evenodd"
									></path></svg
								>
								<a
									href={row.href}
									class="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
								>
									{row.label}
								</a>
							</div>
						</li>
					{/if}
				{/each}
			</ol>
		</nav> -->
	</div>
	<div class="mt-2 sm:flex sm:items-center sm:justify-between">
		<div class="flex-1 min-w-0">
			<h2 class="text-2xl font-bold leading-7 text-white">
				{navValue.title}
			</h2>
		</div>
		<div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
			<button
				on:click={() => navValue.button.action()}
				type="button"
				class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
			>
				{navValue.button.label}
			</button>
		</div>
	</div>
</div>
