import { Types } from "mongoose";
import { Series } from "../../../../models/Series";
import { Match } from "../../../../models/Match";
import { User } from "../../../../models/User";
import { Stat } from "../../../../models/Stat";
import type { Player, Match as MatchType, Action } from '../../../../types';

import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const typeValues = new Map([
    ['FG', 1],
    ['3PT', 2]
  ])
  const series = await Series.findOne({ 'matches': params.id }, "_id")
    .lean();
  const match = await Match.findOne({ _id: params.id })
    .populate('aTeam.players')
    .populate('bTeam.players')
    .lean();
  if (!match) {
    return { acknowledge: false, }
  }
  const parsed = JSON.parse(JSON.stringify(match))
  const { aTeam, bTeam } = parsed

  const aMap: Map<string, Player> = new Map(aTeam.players.map((item: Player) => [item._id, item]));
  const bMap: Map<string, Player> = new Map(bTeam.players.map((item: Player) => [item._id, item]));
  // const combinedMap = new Map([...aMap, ...bMap]);

  const stats = await Stat.find({ match_id: params.id })
    .lean();
  const parsedStats = JSON.parse(JSON.stringify(stats))
  // sanitize
  const history: {
    _id: string
    team: string;
    action: Action;
    player: Player | undefined;
  }[] = []


  let aPoints = 0
  let bPoints = 0
  for (let row of parsedStats) {
    const playerIsATeam = aMap.get(row.player)
    const team = playerIsATeam ? "a" : "b"
    history.push({
      _id: row._id,
      action: {
        made: row.made,
        type: row.type
      },
      team,
      player: playerIsATeam ?? bMap.get(row.player),
    })
  }

  return {
    acknowledge: true,
    aTeam,
    bTeam,
    aMap,
    bMap,
    match: parsed,
    history,
    aPoints,
    bPoints,
    typeValues,
    series: JSON.parse(JSON.stringify(series))
  };
};