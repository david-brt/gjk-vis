import type { GJKPolygons } from '$lib/polygon';
import { polygons } from '$lib/store';
import { get } from 'svelte/store';

export const data = generateData();

function generateData(): Chart.ChartData {
	const ps = get(polygons);
	const res = { datasets: [] };
	for (const key in ps) {
		res.datasets.push({
			label: key,
			data: [],
			showLine: true
		});
	}
	return res;
}
