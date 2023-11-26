<script lang="ts">
	export let data: any;
	console.log(data);
	$: ({ record } = data);
</script>

<h1>Select a car</h1>
<ul>
	{#each record as car}
		<li>
			<h3>{car._id}</h3>
			<h3>{car.name}</h3>
		</li>
	{/each}
</ul>
