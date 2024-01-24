<script lang="ts">
	import type { Player, StatMap } from '../../../types';

	export let data: (StatMap & { player: Player })[] = [];
	const roundToOneDec = (val: number) => {
		return (Math.round(val * 10) / 10).toString() + (Number.isInteger(val) ? '.0' : '');
	};
</script>

<table class="border-collapse separate">
	<thead class="space-y-10">
		<tr class="text-xs font border-b border-gray-600">
			<td class="px-2 py-1 w-full text-left">Name</td>
			<td class="px-2 min-w-[42px] text-right">FG</td>
			<td class="px-2 min-w-[42px] text-left">FG%</td>
			<td class="px-2 min-w-[42px] text-center">3PT</td>
			<td class="px-2 min-w-[42px] text-center">3PT%</td>
			<td class="px-2 min-w-[42px] text-center">POINTS</td>
		</tr>
	</thead>
	<tbody>
		{#each data as row}
			<tr class="text-sm text-center">
				<td class="px-2 py-1 text-left">{row.player.name}</td>
				<td class="">{row['FG'].made}-{row['FG'].attempt}</td>
				<td class=""
					>{row['FG'].attempt == 0
						? '0.0'
						: roundToOneDec((row['FG'].made / row['FG'].attempt) * 100)}</td
				>
				<td class="">{row['3PT'].made}-{row['3PT'].attempt}</td>
				<td
					>{row['3PT'].attempt == 0
						? '0.0'
						: roundToOneDec((row['3PT'].made / row['3PT'].attempt) * 100)}</td
				>
				<td class="">{row['3PT'].made * 2 + row['FG'].made}</td>
			</tr>
		{/each}
	</tbody>
</table>
