import { writable, type Writable } from 'svelte/store';
import { Polygon } from '$lib/polygon';
import type { GJKPolygons } from '$lib/polygon';

const emptyPolygons = {
	a: new Polygon([]),
	b: new Polygon([]),
	mDiff: new Polygon([])
};

export const polygons: Writable<GJKPolygons> = writable(emptyPolygons);

export const selectedPolygon = writable('a');

export const showMinkowski = writable(true);
