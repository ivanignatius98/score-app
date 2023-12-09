import type { Types } from 'mongoose';

export interface Player {
  _id: Types.ObjectId;
  name: string;
}

export interface MatchTeam {
  players: Types.ObjectId[];
  score: number;
}

export interface Match {
  name: string;
  status: string;
  aTeam: MatchTeam;
  bTeam: MatchTeam;
  highlighted?: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Series {
  name: string;
  players: Types.ObjectId[];
  matches: Match[];
  createdBy: Types.ObjectId;
}