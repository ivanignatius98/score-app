import { Types } from 'mongoose';
import { Group } from '../../models/Group';
import { Series } from '../../models/Series';
import { User } from '../../models/User';
import type { Actions, Load } from '@sveltejs/kit';
import type { Player } from '../../types';

export const load: Load = async ({ locals, url }) => {
	if (!locals.user) return;
	const groupParam = url.searchParams.get('group');

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
		return { series: [], members: [] };
	}
	return {
		series: JSON.parse(JSON.stringify(series)),
		members: JSON.parse(JSON.stringify(sortedMembers)),
		groupId
	};
};

export const actions: Actions = {
	store: async ({ request }) => {
		const formData = await request.formData();
		const data = formData.get('data');
		const parsed = JSON.parse(data as string);
		let series = null;
		const { _id, players, ...newSave } = parsed;
		const arrIdPlayers = players.map(({ _id }: Player) => new Types.ObjectId(_id));
		newSave.players = arrIdPlayers;

		if (_id) {
			series = await Series.findOne({ _id });
			if (series) {
				Object.assign(series, newSave);
			} else {
				console.error('Series not found with _id:', _id);
				return { success: false };
			}
		} else {
			series = new Series(newSave);
		}

		try {
			const records = series ? await series.save() : [];
			// console.log('Series saved successfully:', records);
			return {
				success: true,
				records: JSON.parse(JSON.stringify(records))
			};
		} catch (error) {
			console.error('Error saving series:', error);
			// Handle the error
		}
		return { success: false };
	}
	// delete: async ({ request }) => {
	// 	const formData = await request.formData();
	// 	const id = formData.get('id');
	// 	const est = await Series.findByIdAndDelete(id);
	// 	let series = await getInitSeries();
	// 	return {
	// 		success: true,
	// 		records: JSON.parse(JSON.stringify(series))
	// 	};
	// }
};
