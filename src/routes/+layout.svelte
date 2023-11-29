<script>
	import '../app.css';
</script>

<div class="app bg-gray-900 text-white">
	<main>
		<div>
			<div>
				<nav class="sm:hidden" aria-label="Back">
					<a
						href="#"
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
					</a>
				</nav>
				<nav class="hidden sm:flex" aria-label="Breadcrumb">
					<ol role="list" class="flex items-center space-x-4">
						<li>
							<div class="flex">
								<a href="#" class="text-gray-400 hover:text-gray-500">
									<a href="#" class="text-sm font-medium text-gray-400 hover:text-gray-200">
										Jobs
									</a>
								</a>
							</div>
						</li>
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
								<a href="#" class="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200">
									Engineering
								</a>
							</div>
						</li>
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
									href="#"
									aria-current="page"
									class="ml-4 text-sm font-medium text-gray-400 hover:text-gray-200"
								>
									Back End Developer
								</a>
							</div>
						</li>
					</ol>
				</nav>
			</div>
			<div class="mt-2 md:flex md:items-center md:justify-between">
				<div class="flex-1 min-w-0">
					<h2 class="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
						Back End Developer
					</h2>
				</div>
				<div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
					<button
						type="button"
						class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
					>
						Edit
					</button>
					<button
						type="button"
						class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
					>
						Publish
					</button>
				</div>
			</div>
		</div>
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
