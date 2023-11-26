<script lang="ts">
	export let data: any;
	$: ({ record } = data);
</script>

<div class="flow-root mt-6">
	<ul role="list" class="-my-5 divide-y divide-gray-200">
		{#each record as person}
			<li class="py-4">
				<div class="flex items-center space-x-4">
					<div class="flex-shrink-0">
						<img class="h-8 w-8 rounded-full" src={person.imageUrl} alt="" />
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-white truncate">{person.name}</p>
						<p class="text-sm text-gray-500 truncate">{'@' + person.handle}</p>
					</div>
					<div>
						<span
							class='bg-gray-900 group-hover:bg-gray-800 ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full'
						>
							View
						</span>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
<div class="mt-6">
	<a
		href="#"
		class="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
	>
		View all
	</a>
</div>
