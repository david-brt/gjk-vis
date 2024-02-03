import { get } from 'svelte/store';
import { getRelativePosition } from 'chart.js/helpers';
import { Point } from '$lib/point';
import { Polygon, minkowskiDifference } from '$lib/polygon';
import { setDimensions } from '$lib/graph';
import * as store from '$lib/store';

export function updateChart(e: Event, chart: any) {
	const polygons = get(store.polygons);
	const selectedColor = get(store.selectedColor);
	const showMinkowski = get(store.showMinkowski);

	const canvasPosition = getRelativePosition(e, chart);
	let dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
	let dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

	dataX = Math.round(dataX * 10) / 10;
	dataY = Math.round(dataY * 10) / 10;

	chart.data.datasets.forEach((dataset: Chart.ChartDataSets) => {
		const color = selectedColor;
		if (dataset.label != color) return;
		// update store
		store.polygons.update((p) => {
			const point = new Point(dataX, dataY);
			p[color] ? p[color].addPoint(point) : (p[color] = new Polygon([point]));
			return p;
		});
		// update chart
		dataset.data = polygons[color].getDrawable();
	});
	if (polygons['red'] === undefined || polygons['blue'] === undefined) {
		chart.update('none');
		return;
	}

	const visiblePolygons = polygons;
	visiblePolygons['mDiff'] = new Polygon([]);
	chart.data.datasets[2].data = [];

	let mDiff = minkowskiDifference(polygons['red'], polygons['blue']).getDrawable();
	mDiff = mDiff.map((point) => new Point(point.x, point.y));
	polygons['mDiff'] = new Polygon(mDiff as Point[]);
	chart.data.datasets[2].data = showMinkowski ? polygons['mDiff'].getDrawable() : [];

	setDimensions(chart.options.scales, chart.data.datasets);
	chart.update('none');
}
