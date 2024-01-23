import { Types } from "mongoose";
import { Series } from "../../../models/Series";
import { User } from "../../../models/User";
import { Stat } from "../../../models/Stat";
import type { Player, Match } from '../../../types';

import type { Actions, Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
  const series = await Series.findOne({ 'matches._id': params.id },
    { matches: 1 })
    .populate('players')
    .lean();
  if (!series) {
    return { acknowledge: false, matches: [], players: [] }
  }
  const { matches, players } = JSON.parse(JSON.stringify(series));
  const match = matches.find((item: (Match & { _id: string })) => item._id === params.id);
  function mapPlayers(teamPlayers: string[], dataMap: Map<string, string>) {
    return teamPlayers.map((item) => ({
      _id: new Types.ObjectId(item),
      name: dataMap.get(item) // Set the desired name
    }));
  }
  const { aTeam, bTeam } = match
  const dataMap: Map<string, string> = new Map(players.map((item: Player) => [item._id, item.name]));

  const aPlayers = mapPlayers(aTeam.players, dataMap);
  const bPlayers = mapPlayers(bTeam.players, dataMap);

  return {
    acknowledge: true,
    aPlayers: JSON.parse(JSON.stringify(aPlayers)),
    bPlayers: JSON.parse(JSON.stringify(bPlayers)),
    aScore: aTeam.score,
    bScore: bTeam.score,
    match
  };
};