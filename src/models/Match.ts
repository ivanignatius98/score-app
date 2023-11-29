import mongoose, { Schema } from 'mongoose';

const MatchSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    enum: ['live', 'archived', 'upcoming'],
    default: 'upcoming'
  },
  aTeam: {
    players: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    score: Number
  },
  bTeam: {
    players: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    score: Number
  },
  highlighted: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});


// Create Match model
export const Match = mongoose.model('matches', MatchSchema);
