<script lang="ts">
	import type { Player, StatMap } from '../../../types';

	export let data: (StatMap & { player: Player })[] = [];
</script>

<table class="border-collapse separate">
	<thead class="space-y-10">
		<tr class="text-xs font border-b border-gray-600">
			<td class="px-2 py-1 w-full text-left">Name</td>
			<td class="px-2 min-w-[36px] text-center">FG</td>
			<td class="px-2 min-w-[36px] text-center">3PT</td>
			<td class="px-2 min-w-[36px] text-center">POINTS</td>
		</tr>
	</thead>
	<tbody>
		{#each data as row}
			<tr class="text-sm">
				<td class="px-2 py-1">{row.player.name}</td>
				<td class="text-center">{row['FG'].made}-{row['FG'].attempt}</td>
				<td class="text-center">{row['3PT'].made}-{row['3PT'].attempt}</td>
				<td class="text-center">{row['3PT'].made * 2 + row['FG'].made}</td>
			</tr>
		{/each}
	</tbody>
</table>
