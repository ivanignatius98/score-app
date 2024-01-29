import { Types } from 'mongoose';
import { Series } from '../models/Series';
import { User } from '../models/User';
import type { Actions, Load } from '@sveltejs/kit';
import prisma from '$lib/prisma';
import { getInitials } from '../helpers/general';

const getInitSeries = () => {
	return Series.find().populate('players').sort({ createdAt: -1 }).lean();
};

export const load: Load = async () => {
	// let series = await getInitSeries();
	// let members = await User.find().lean();

	try {
		const dataMap = new Map();

		const members = await prisma.user.findMany({
			select: {
				id: true,
				name: true
			},
			orderBy: {
				name: 'asc'
			}
		});

		const players = members.map(({ id, name }) => {
			dataMap.set(id, name);
			return { id, name };
		});

		const series = await prisma.series.findMany({
			select: {
				id: true,
				name: true,
				date: true,
				seriesUser: {
					select: {
						player: {
							select: {
								id: true,
								name: true
							}
						}
					},
					orderBy: {
						player: {
							name: 'asc'
						}
					}
				}
			}
		});

		const parsed = series.map((item) => {
			const temp = [];
			const set = new Set();
			for (const row of item.seriesUser) {
				const name = dataMap.get(row.player.id);
				const tempRow = {
					_id: row.player.id,
					name,
					initials: getInitials(name),
					colorClass: 'bg-red-500'
				};
				temp.push(tempRow);
				set.add(row.player.id);
			}
			return {
				...item,
				players: temp,
				playerIds: set
			};
		});
		return { series: parsed, members: players };
	} catch (error) {
		console.log(error);
		return { series: [], members: [] };
	}
};

export const actions: Actions = {
	store: async ({ request }) => {
		const formData = await request.formData();
		const data = formData.get('data');
		const parsed = JSON.parse(data as string);
		let { id, ...newSave } = parsed;
		console.log(parsed);
		try {
			if (id) {
				const updated = await prisma.series.update({
					where: {
						id
					},
					data: {
						name: newSave.name,
						date: new Date(newSave.date)
					}
				});

				if (updated.id) {
					await prisma.seriesUser.deleteMany({
						where: {
							seriesId: updated.id
						}
					});
				}
			} else {
				const created = await prisma.series.create({
					data: {
						name: newSave.name,
						date: new Date(newSave.date)
					}
				});
				console.log(created);
				id = created.id;
			}

			const createMany = await prisma.seriesUser.createMany({
				data: newSave.players.map((row: string) => ({ seriesId: id, playerId: row })),
				skipDuplicates: true
			});
			console.log(createMany);
			return { success: true };
		} catch (error) {
			console.error(error);
		}
		return { success: false };
	},
	delete: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const est = await Series.findByIdAndDelete(id);
		console.log(est);
		let series = await getInitSeries();
		return {
			success: true,
			records: JSON.parse(JSON.stringify(series))
		};
	}
};
