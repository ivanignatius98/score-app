import mongoose, { Schema } from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  name: String,
  date: Date,
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  matches: [{
    type: Schema.Types.ObjectId,
    ref: 'Match'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Series = mongoose.model('series', SeriesSchema);
