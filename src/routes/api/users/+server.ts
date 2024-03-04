import { json } from '@sveltejs/kit';
import { User } from '../../../models/User.js';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { name } = await request.json();
	const newRecord = await User.create({ name, password: 'password' });

	return json({
		success: true,
		record: newRecord
	});
}

export async function DELETE({ request }) {
	const { _id } = await request.json();
	await User.findOneAndDelete({ _id });
	return json({
		success: true
	});
}
