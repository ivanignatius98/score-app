// combinedStore.js
import { writable } from 'svelte/store';
interface NavValue {
  title: string;
  buttonAction: () => void;
  breadcrumbs: { href: string; label: string }[];
}

const initialState: NavValue = {
  title: 'Default Title',
  buttonAction: () => {
    // Default action
    console.log('Default button action');
  },
  breadcrumbs: []
};

export const navbarStore = writable(initialState);
