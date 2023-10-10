import { writable } from 'svelte/store';
import {sketchBookState} from "./SketchBookState";

export const SketchBookStore = writable(
  sketchBookState
);
