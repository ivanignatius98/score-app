import { json } from '@sveltejs/kit';
import { Series } from '../../../models/Series.js';
import { Group } from '../../../models/Group.js';
// import type { Player, StatMap, Match as MatchType } from '../../../../types/index.js';
// import type { Schema } from 'mongoose';

/** @type {import('./$types').RequestHandler} */
export async function GET({ request, locals, url }) {
	let groupParam = url.searchParams.get('group');
	if (!locals.user) return json({ success: false });
	let groupId = null;
	let members = [];

	if (!groupParam) {
		if (locals.user.groupIds) {
			groupId = locals.user.groupIds[0];
		} else {
			groupId = locals.user._id;
		}
	} else {
		groupId = groupParam;
	}

	if (groupId != locals.user._id) {
		const group = await Group.findOne({ _id: groupId }).lean().populate('members');
		if (!group) {
			return { series: [], members: [] };
		}

		members = group.members.map((item) => item);
	} else {
		members = [{ ...locals.user }];
	}

	const series = await Series.find({ groupId }).populate('players').sort({ createdAt: -1 }).lean();
	const sortedMembers = members.sort((a: any, b: any) => {
		// Convert names to lowercase for case-insensitive sorting
		const nameA = a.name.toLowerCase();
		const nameB = b.name.toLowerCase();
		// Compare names and return the result
		if (nameA < nameB) {
			return -1;
		}
		if (nameA > nameB) {
			return 1;
		}
		return 0;
	});
	if (!series) {
		return json({ series: [], members: [] });
	}
	return json({
		success: true,
		series,
		members: sortedMembers,
		groupId
	});
}
