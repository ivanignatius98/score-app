<script lang="ts">
	import type { StatSummary } from '../../types';

	export let data: StatSummary[] = [];
</script>

{#if data && data.length > 0}
	<table class="border-collapse separate">
		<thead class="space-y-10">
			<tr class="text-xs font border-b border-gray-600">
				<td class="px-2 py-1 w-full text-left">Name</td>
				<td class="px-2 min-w-[42px] text-right">FG</td>
				<td class="px-2 min-w-[42px] text-right">FG%</td>
				<td class="px-2 min-w-[42px] text-right">2PT</td>
				<!-- <td class="px-2 min-w-[42px] text-left">FG%</td> -->
				<td class="px-2 min-w-[42px] text-center">3PT</td>
				<!-- <td class="px-2 min-w-[42px] text-center">3PT%</td> -->
				<td class="px-2 min-w-[42px] text-center">POINTS</td>
				{#if data[0]['games']}
					<td class="px-2 min-w-[42px] text-center">GAMES</td>
				{/if}
				{#if data[0]['PPG']}
					<td class="px-2 min-w-[42px] text-center">PPG</td>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each data as row}
				<tr class="text-sm text-center">
					<td class="px-2 py-1 text-left">{row.player}</td>
					<td class="">{row['FG']}</td>
					<td class="">{row['FG%']}</td>
					<!-- <td class="">{row['FG%']}</td> -->
					<td class="">{row['2PT']}</td>
					<td class="">{row['3PT']}</td>
					<!-- <td class="">{row['3PT%']}</td> -->
					<td class="">{row['PTS']}</td>
					{#if row['games']}
						<td class="">{row['games']}</td>
					{/if}
					{#if row['PPG']}
						<td class="">{row['PPG']}</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
