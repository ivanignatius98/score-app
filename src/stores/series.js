// combinedStore.js
import { writable } from 'svelte/store';

const initialState = {
  matches: ['']
};

export const seriesStore = writable(initialState);