import { Types } from 'mongoose';
import { Match } from '../../../models/Match';
import { User } from '../../../models/User';
import { Series } from '../../../models/Series';
import type { Player } from '../../../types';

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
			createdAt: true
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

	const matchPlayers = await prisma.matchPlayer.findMany({
		select: {
			team: true,
			matchId: true,
			playerId: true
		},
		where: {
			matchId: {
				in: matches.map(({ id }) => id)
			}
		}
	});

	return {
		acknowledge: true,
		matches,
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
		const series = await Series.findOne({ _id: params.id }).populate('matches');
		if (!series) return { success: false };
		let matches = [...series.matches];
		let { _id, ...newSave } = parsed;
		if (_id) {
			await Match.updateOne({ _id }, newSave);
			const index = matches.findIndex((item) => item._id && item._id.equals(_id));
			if (index !== -1) {
				// Create a new array with the updated item
				matches[index] = { ...matches[index], ...parsed };
			}
		} else {
			const newRecord = await Match.create(newSave);
			(series as any).matches = [newRecord._id, ...series.matches];
			matches = [newRecord as any, ...matches];
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
