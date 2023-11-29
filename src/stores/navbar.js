// combinedStore.js
import { writable } from 'svelte/store';

const initialState = {
  title: 'Default Title',
  buttonAction: () => {
    // Default action
    console.log('Default button action');
  },
};

export const navbarStore = writable(initialState);