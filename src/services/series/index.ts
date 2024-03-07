import { roundToOneDec } from '../../helpers/general';
import type { StatMap } from '../../types';

export const matchSummary = async (_id: string) => {
	try {
		const response = await fetch(`/api/series/${_id}/matches-summary`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		const { summ, dataMap, matchCountMap, success } = await response.json();
		if (!success) return { success };
		const playerStats = new Map();

		// count stats
		for (const row of summ) {
			const defaultStat: StatMap = {
				FG: {
					made: 0,
					attempt: 0
				},
				'3PT': {
					made: 0,
					attempt: 0
				}
			};
			if (!row.player) {
				return { success: false, matches: [], players: [] };
			}
			const playerId = row.player.toString();
			const existingPlayer = playerStats.get(playerId);
			if (existingPlayer) {
				const plStat = existingPlayer;

				plStat[row.type].attempt++;
				plStat[row.type].made += row.made ? 1 : 0;
				playerStats.set(playerId, plStat);
			} else {
				defaultStat[row.type].attempt++;
				defaultStat[row.type].made += row.made ? 1 : 0;

				playerStats.set(playerId, { ...defaultStat, player: dataMap[playerId] });
			}
		}
		const arr = [];
		for (const [key, value] of playerStats) {
			const fg = `${value['FG'].made + value['3PT'].made}/${
				value['FG'].attempt + value['3PT'].attempt
			}`;
			const two = `${value['FG'].made}/${value['FG'].attempt}`;
			const three = `${value['3PT'].made}/${value['3PT'].attempt}`;
			// const fgperc =
			// 	value['FG'].attempt == 0
			// 		? '0.0'
			// 		: roundToOneDec((value['FG'].made / value['FG'].attempt) * 100);
			// const threeperc =
			// 	value['3PT'].attempt == 0
			// 		? '0.0'
			// 		: roundToOneDec((value['3PT'].made / value['3PT'].attempt) * 100);

			const pts = value['FG'].made * 2 + value['3PT'].made * 3;
			const games = matchCountMap[key];

			arr.push({
				player: value.player,
				FG: fg,
				'FG%': `${roundToOneDec(
					((value['FG'].made + value['3PT'].made) / (value['FG'].attempt + value['3PT'].attempt)) *
						100
				)}`,
				'2PT': two,
				// 'FG%': fgperc,
				'3PT': three,
				// '3PT%': threeperc,
				games,
				PPG: roundToOneDec(pts / games),
				PTS: pts
			});
		}
		return { success, record: arr.length > 0 ? arr.sort((a: any, b: any) => b.PPG - a.PPG) : [] };
	} catch (error) {
		console.error('Error submitting form', error);
		return { success: false };
	}
};

export const list = async (groupId: string) => {
	try {
		const response = await fetch(`/api/series?group=${groupId}`, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});

		return response.json();
	} catch (error) {
		console.error('Error submitting form', error);
		return { success: false };
	}
};
