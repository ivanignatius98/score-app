import mongoose from 'mongoose';
import type { MatchModelType } from '../types';

const MatchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    }
  }
);

export const Match = mongoose.model<MatchModelType>('matches', MatchSchema);
