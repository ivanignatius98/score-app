import { json } from '@sveltejs/kit';
import { User } from '../../../models/User.js';
import { Group } from '../../../models/Group.js';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { name, groupId } = await request.json();
	const newRecord = await User.create({ name, password: 'password', groupIds: [groupId] });

	await Group.findByIdAndUpdate(
		groupId,
		{ $push: { members: newRecord._id } },
		{ new: true, useFindAndModify: false }
	);
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
