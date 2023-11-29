import { Match } from "../../models/Match";
import type { Load } from '@sveltejs/kit';

export const load: Load = async () => {
  let record = await Match.find({}).lean();
  record = JSON.parse(JSON.stringify(record));
  return {
    record,
  };
};
