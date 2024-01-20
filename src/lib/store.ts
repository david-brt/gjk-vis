import { writable, type Writable } from 'svelte/store';
import { Point } from '$lib/point';

type PolygonMap = { [color: string]: Point[] };

export const polygons: Writable<PolygonMap> = writable({});

export const selectedColor = writable('red');
