import { polygons } from '$lib/store';
import { get } from 'svelte/store';
import { gjkState } from './store';

export const data = {
	datasets: generateData()
} as Chart.ChartData;

function generateData() {
	const ps = get(polygons);
	const res = [];
	for (const key in ps) {
		res.push({
			label: key,
			data: [],
			showLine: true
		});
	}

	const gjk = get(gjkState);
	Object.keys(gjk).forEach((key) => {
		res.push({
			label: key,
			data: [],
			showLine: true
		});
	});
	return res;
}
