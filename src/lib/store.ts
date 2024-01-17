import { writable, type Writable } from 'svelte/store';
import { Point } from '$lib/point';

type Polygon = { [color: string]: Point[] };

export const polygons: Writable<Polygon> = writable({});

export const selectedColor = writable('blue');
