import mongoose, { Schema } from 'mongoose';

const SeriesSchema = new mongoose.Schema({
  name: String,
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Series = mongoose.model('series', SeriesSchema);
