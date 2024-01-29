import { Match } from '../../../models/Match';
import { Series } from '../../../models/Series';

import { getInitials } from '../../../helpers/general.js';

import type { Actions, Load } from '@sveltejs/kit';
import prisma from '$lib/prisma';

export const load: Load = async ({ params }) => {
	const seriesUsers = await prisma.seriesUser.findMany({
		select: {
			player: {
				select: {
					id: true,
					name: true
				}
			}
		},
		where: {
			seriesId: params.id
		},
		orderBy: {
			player: {
				name: 'asc'
			}
		}
	});

	const matches = await prisma.match.findMany({
		select: {
			id: true,
			number: true,
			status: true,
			createdAt: true,
			matchPlayer: {
				select: {
					team: true,
					playerId: true
				}
			}
		},
		where: {
			seriesId: params.id
		},
		orderBy: {
			number: 'desc'
		}
	});

	const dataMap = new Map();

	const players = seriesUsers.map(({ player }) => {
		dataMap.set(player.id, player.name);
		return player;
	});

	const parsed = matches.map((item) => {
		const tempA = [];
		const tempB = [];
		const setA = new Set();
		const setB = new Set();
		for (const row of item.matchPlayer) {
			const name = dataMap.get(row.playerId);
			const temp = {
				_id: row.playerId,
				name,
				initials: getInitials(name)
			};
			if (row.team == 'A') {
				tempA.push(temp);
				setA.add(row.playerId);
			} else if (row.team == 'B') {
				tempB.push(temp);
				setB.add(row.playerId);
			}
		}
		return {
			...item,
			aTeam: { players: tempA, ids: setA },
			bTeam: { players: tempB, ids: setB }
		};
	});
	return {
		acknowledge: true,
		matches: parsed,
		players,
		playersMap: dataMap,
		series_id: params.id
	};
};

export const actions: Actions = {
	store: async ({ request, params }) => {
		const formData = await request.formData();
		const data = formData.get('data');
		const parsed = JSON.parse(data as string);
		// const series = await Series.findOne({ _id: params.id }).populate('matches');
		// if (!series) return { success: false };
		// let matches = [...series.matches];
		// let { _id, ...newSave } = parsed;
		// if (_id) {
		// 	await Match.updateOne({ _id }, newSave);
		// 	const index = matches.findIndex((item) => item._id && item._id.equals(_id));
		// 	if (index !== -1) {
		// 		// Create a new array with the updated item
		// 		matches[index] = { ...matches[index], ...parsed };
		// 	}
		// } else {
		// 	const newRecord = await Match.create(newSave);
		// 	(series as any).matches = [newRecord._id, ...series.matches];
		// 	matches = [newRecord as any, ...matches];
		// }

		// await series.save();

		// return {
		// 	success: true,
		// 	records: JSON.parse(JSON.stringify(matches))
		// };
		return {
			success: true,
			records: []
		};
	},
	delete: async ({ request, params }) => {
		const formData = await request.formData();
		const data = formData.get('data');
		const parsed = JSON.parse(data as string);
		await Match.findByIdAndDelete(parsed._id);
		const series = await Series.findOne({ _id: formData.get('series_id') }).populate('matches');
		if (!series) {
			return { success: false };
		}
		const indexToDelete = series.matches.findIndex((obj) => obj._id.toString() === parsed._id);
		if (indexToDelete !== -1) {
			series.matches.splice(indexToDelete, 1);
		}
		await series.save();

		return {
			success: true,
			records: JSON.parse(JSON.stringify([...series.matches]))
		};
	}
};
