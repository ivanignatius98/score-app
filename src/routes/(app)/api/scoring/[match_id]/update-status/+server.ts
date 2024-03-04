import { json } from '@sveltejs/kit';
import { Match } from '../../../../../../models/Match.js';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request, params }) {
  const { match_id } = params;
  const record = await Match.findOne({ _id: match_id })

  if (!record) {
    return json(false);
  }
  const newStatus = record.status == "archived" ? "live" : "archived"
  record.status = newStatus
  record?.save()
  return json({
    success: true,
    res: newStatus
  });
}