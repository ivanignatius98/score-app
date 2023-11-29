import type { Document, Types } from 'mongoose';

export interface Player {
  _id: Types.ObjectId;
  name: string;
}

export interface MatchTeam {
  players: Types.ObjectId[];
  score: number;
}

export interface Match extends Document {
  name: string;
  status: 'live' | 'archived' | 'upcoming';
  aTeam: MatchTeam;
  bTeam: MatchTeam;
  highlighted: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
