// combinedStore.js
import { writable } from 'svelte/store';
interface NavValue {
  title: string;
  button: {
    label: string,
    action: () => void
  }
  breadcrumbs: { href: string; label: string }[];
}

const initialState: NavValue = {
  title: 'Default Title',
  button: {
    label: "Create",
    action: () => { }
  },
  breadcrumbs: []
};

export const navbarStore = writable(initialState);
