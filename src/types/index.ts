import type { Types } from 'mongoose';

export interface Player {
	id: string;
	name: string;
	initials?: string;
}

export interface MatchTeam {
	players: Player[];
	ids: Set<string>;
	score: number;
}

export interface Match {
	number: number;
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
	date: Date;
	players: Player[];
	playerIds: Set<string>;
	matches: Match[];
	createdBy: Types.ObjectId;
}

export interface NavValue {
	title: string;
	button: {
		label: string;
		action: () => void;
	};
	breadcrumbs: { href: string; label: string }[];
	backNav: string;
}

export interface Action {
	made: boolean;
	value?: number;
	type: string;
}

export interface StatMap {
	[key: string]: {
		made: number;
		attempt: number;
	};
}
