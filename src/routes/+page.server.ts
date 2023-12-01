import { Match } from "../models/Match";
import { User } from "../models/User";
import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
  let record = await Match.find({}).lean();
  record = JSON.parse(JSON.stringify(record));
  let players = await User.find({}).lean();
  players = JSON.parse(JSON.stringify(players));
  return {
    record,
    players
  };
};
