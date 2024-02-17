<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	let isLoading = false;
</script>

<div class="h-0 min-h-[576px]">
	<form
		method="post"
		class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
		use:enhance={({ formData, cancel }) => {
			// formData.append('data', JSON.stringify(newSeries));
			isLoading = true;
			let redir = '';
			return async ({ update, result }) => {
				if (result.status == 200 && result.type == 'success' && result.data) {
					if (result.data.success) redir = '/';
				}
				isLoading = false;
				await update();

				if (redir) goto(redir);
			};
		}}
	>
		<div class="max-w-md w-full space-y-8">
			<div>
				<img
					class="mx-auto h-12 w-auto"
					src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
					alt="Workflow"
				/>
				<h2 class="mt-6 text-center text-3xl font-extrabold">Sign in to your account</h2>
				<p class="mt-2 text-center text-sm text-gray-600">
					Or
					<!-- space -->
					<a href="#" class="font-medium text-indigo-500 hover:text-indigo-400"> register here </a>
				</p>
			</div>
			<div class="mt-8 space-y-6">
				<input type="hidden" name="remember" value="true" />
				<div class="rounded-md shadow-sm -space-y-px">
					<div>
						<label for="email-address" class="sr-only">Email address</label>
						<input
							type="text"
							name="name"
							class="border sm:text-sm rounded-t-md block w-full py-2 px-3 bg-gray-800 border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-gray-300"
							placeholder="Email"
							required
						/>
					</div>
					<div>
						<label for="password" class="sr-only">Password</label>
						<input
							type="password"
							name="password"
							autocomplete="current-password"
							class="border sm:text-sm rounded-b-md block w-full py-2 px-3 bg-gray-800 border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 text-gray-300"
							placeholder="Password"
							required
						/>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label for="remember-me" class="ml-2 block text-sm"> Remember me </label>
					</div>

					<div class="text-sm">
						<a href="#" class="font-medium text-indigo-500 hover:text-indigo-400">
							Forgot your password?
						</a>
					</div>
				</div>

				<div>
					<button
						type="submit"
						class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						<span class="absolute left-0 inset-y-0 flex items-center pl-3">
							<svg
								class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									fill-rule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
									clip-rule="evenodd"
								></path>
							</svg>
						</span>
						Sign in
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
