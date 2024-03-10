import { json } from '@sveltejs/kit';
import { Match } from '../../../models/Match.js';
import { Stat } from '../../../models/Stat.js';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { match_id, action, person } = await request.json();

	const populatePayload = {
		match_id,
		player: person._id,
		type: action.type,
		made: action.made,
		zone: action.zone
	};
	const newRecord = await Stat.create(populatePayload);

	return json({
		success: true,
		record: newRecord
	});
}

export async function DELETE({ request }) {
	const { _id } = await request.json();
	await Stat.findOneAndDelete({ _id });
	return json({
		success: true
	});
}
