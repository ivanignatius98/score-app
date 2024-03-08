import mongoose, { Schema } from 'mongoose';

const StatSchema = new mongoose.Schema(
	{
		match_id: {
			type: Schema.Types.ObjectId,
			ref: 'Matches'
		},
		player: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		type: {
			type: String,
			enum: ['FG', '3PT', 'BLK', 'REB', 'STL'],
			default: 'FG'
		},
		zone: {
			type: String,
			enum: [
				'RIGHT-ELBOW',
				'LEFT-ELBOW',
				'FREE-THROW',
				'LEFT-CORNER',
				'RIGHT-CORNER',
				'SHORT-LEFT-CORNER',
				'SHORT-RIGHT-CORNER',
				'LEFT-LOW-POST',
				'RIGHT-LOW-POST',
				'LEFT-WING',
				'RIGHT-WING',
				'POINT',
				'HIGH-POST',
				'PAINT'
			],
			default: null
		},
		made: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

export const Stat = mongoose.model('Stat', StatSchema);
