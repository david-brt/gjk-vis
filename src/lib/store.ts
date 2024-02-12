import { writable, type Writable } from 'svelte/store';
import { Polygon } from '$lib/polygon';
import type { GJKPolygons } from '$lib/polygon';
import { GjkState } from '$lib/gjk';

const emptyPolygons = {
	a: new Polygon([]),
	b: new Polygon([]),
	mDiff: new Polygon([]),
	simplex: new Polygon([])
};

export const polygons: Writable<GJKPolygons> = writable(emptyPolygons);

export const selectedPolygon: Writable<keyof GJKPolygons> = writable('a');

export const showMinkowski = writable(true);

export const gjkState = writable(new GjkState());

export const chart: Writable<any> = writable();
