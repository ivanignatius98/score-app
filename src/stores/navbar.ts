// combinedStore.js
import { writable } from 'svelte/store';
import type { NavValue } from '../types';

const initialState: NavValue = {
	title: 'Default Title',
	buttons: [
		{
			label: 'Create',
			action: () => {}
		}
	],
	breadcrumbs: [],
	backButton: {
		label: 'Create',
		action: () => {}
	}
};

export const navbarStore = writable(initialState);
