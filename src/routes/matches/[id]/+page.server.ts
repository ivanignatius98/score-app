import { Types } from 'mongoose';
import { Match } from '../../../models/Match';
import { User } from '../../../models/User';
import { Series } from '../../../models/Series';
import type { Player } from '../../../types';

import type { Actions, Load } from '@sveltejs/kit';

export const load: Load = async ({ params }) => {
	const series = await Series.findOne({ _id: params.id })
		.populate('players')
		.populate('matches')
		.lean();
	if (!series) {
		return { acknowledge: false, matches: [], players: [] };
	}
	const { matches, players } = JSON.parse(JSON.stringify(series));
	const sortedPlayers = players.sort((a: any, b: any) => {
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
	const sortedMatches = matches.sort((a: any, b: any) => b.number - a.number);
	const dataMap = new Map(players.map((item: Player) => [item._id, item.name]));
	return {
		acknowledge: true,
		matches: sortedMatches,
		players: sortedPlayers,
		playersMap: dataMap,
		series_id: series._id.toString()
	};
};

export const actions: Actions = {
	store: async ({ request, params }) => {
		const formData = await request.formData();
		const data = formData.get('data');
		const parsed = JSON.parse(data as string);
		const series = await Series.findOne({ _id: params.id }).populate("matches");
		if (!series) return { success: false };
		let matches = [...series.matches]
		let { _id, ...newSave } = parsed;

		if (_id) {
			await Match.updateOne({ _id }, newSave)
			const index = matches.findIndex((item) => item._id && item._id.equals(_id));
			if (index !== -1) {
				// Create a new array with the updated item
				matches[index] = { ...matches[index], ...parsed };
			}
		} else {
			const newRecord = await Match.create(newSave);
			(series as any).matches = [newRecord._id, ...series.matches]
			matches = [(newRecord as any), ...matches]
		}

		await series.save();
		return {
			success: true,
			records: JSON.parse(JSON.stringify(matches))
		};
	},
	delete: async ({ request, params }) => {
		const formData = await request.formData();
		const data = formData.get('data');
		const parsed = JSON.parse(data as string);
		await Match.findByIdAndDelete(parsed._id);
		const series = await Series.findOne({ _id: formData.get('series_id') }).populate("matches")
		if (!series) {
			return { success: false }
		}
		const indexToDelete = series.matches.findIndex(obj => obj._id.toString() === parsed._id);
		if (indexToDelete !== -1) {
			series.matches.splice(indexToDelete, 1);
		}
		await series.save()

		return {
			success: true,
			records: JSON.parse(JSON.stringify([...series.matches]))
		};
	},
};
