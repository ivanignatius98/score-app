import { json } from '@sveltejs/kit';
import { Stat } from '../../../../../models/Stat.js';
import { Series } from '../../../../../models/Series.js';
import type { Player, StatMap, Match as MatchType } from '../../../../../types/index.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, params }) {

  const series = await Series.findOne({ _id: params.id })
    .populate('players')
    .populate('matches')
    .lean();
  if (!series) {
    return json({ acknowledge: false, matches: [], players: [] });
  }
  const { matches, players } = JSON.parse(JSON.stringify(series));
  const dataMap = new Map(players.map((item: Player) => [item._id, item.name]));
  const matchIds: string[] = []
  matches.forEach((element: (MatchType & { _id: any })) => {
    matchIds.push(element._id.toString())
  });
  const summ = await Stat.find({ "match_id": { "$in": matchIds } }).lean();

  let playerStats = new Map();

  // count stats
  for (let row of summ) {
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
      return json({ acknowledge: false, matches: [], players: [] });
    }
    const playerId = row.player.toString()
    const existingPlayer = playerStats.get(playerId)
    if (existingPlayer) {
      const plStat = existingPlayer;

      plStat[row.type].attempt++;
      plStat[row.type].made += row.made ? 1 : 0;
      playerStats.set(playerId, plStat);
    } else {
      defaultStat[row.type].attempt++;
      defaultStat[row.type].made += row.made ? 1 : 0;

      playerStats.set(playerId, { ...defaultStat, player: dataMap.get(playerId) });
    }
  }
  const arr = []
  const roundToOneDec = (val: number) => {
    return (Math.round(val * 10) / 10).toString() + (Number.isInteger(val) ? '.0' : '');
  };
  for (let [key, value] of playerStats) {
    const fg = `${value['FG'].made}/${value['FG'].attempt}`
    const three = `${value['3PT'].made}/${value['3PT'].attempt}`
    const fgperc = value['FG'].attempt == 0
      ? '0.0'
      : roundToOneDec((value['FG'].made / value['FG'].attempt) * 100)
    const threeperc = value['3PT'].attempt == 0
      ? '0.0'
      : roundToOneDec((value['3PT'].made / value['3PT'].attempt) * 100)
    arr.push({
      player: value.player,
      "FG": fg,
      "FG%": fgperc,
      "3PT": three,
      "3PT%": threeperc
    })
  }
  console.table(arr)
  return json({
    success: true,
    record: arr
  });
}
