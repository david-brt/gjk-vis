import { writable, type Writable } from 'svelte/store';
import { Polygon } from '$lib/polygon';

type PolygonMap = { [color: string]: Polygon };

export const polygons: Writable<PolygonMap> = writable({});

export const selectedColor = writable('red');
