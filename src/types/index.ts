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
  date: string;
  players: Player[];
  matches: Match[];
  createdBy: Types.ObjectId;
}

export interface NavValue {
  title: string;
  buttonAction: () => void;
  breadcrumbs: { href: string; label: string }[];
}