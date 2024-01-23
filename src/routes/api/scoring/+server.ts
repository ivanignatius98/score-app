import { json } from '@sveltejs/kit';
import { Stat } from "../../../models/Stat.js";
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { match_id, action, person } = await request.json();

	const populatePayload = {
		match_id,
		player: person._id,
		type: action.type,
		made: action.made
	}
	await Stat.create(populatePayload)

	return json(true);
}
