import mongoose, { Schema } from 'mongoose';

const StatSchema = new mongoose.Schema({
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
  coords: {
    x: Number,
    y: Number
  },
  make: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

export const Stat = mongoose.model('Stat', StatSchema);
