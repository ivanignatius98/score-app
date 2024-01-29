import mongoose, { Schema } from 'mongoose';

const MatchSchema = new mongoose.Schema({
  number: Number,
  status: {
    type: String,
    enum: ['live', 'archived'],
    default: 'live'
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
    default: false,
    required: false
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export const Match = mongoose.model('Match', MatchSchema);
