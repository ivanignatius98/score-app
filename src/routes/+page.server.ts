import { Series } from "../models/Series";
import { User } from "../models/User";
import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
  let series = await Series.findOne({ _id: '656c6b43d4edeb643612d207' }).lean();

  if (!series) {
    return { matches: [], players: [] }
  }
  const { matches, players } = JSON.parse(JSON.stringify(series));
  return {
    matches,
    players
  };
};
