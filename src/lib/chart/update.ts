import { get } from 'svelte/store';
import { getRelativePosition } from 'chart.js/helpers';
import { Point } from '$lib/point';
import { Polygon, minkowskiDifference } from '$lib/polygon';
import { setDimensions } from '$lib/chart/scales';
import { generateSubstateConfig } from '$lib/chart/substate';
import * as store from '$lib/store';

export function updatePolygons(e: Event) {
	const polygons = get(store.polygons);
	const polygonIndex = get(store.selectedPolygon);
	const showMinkowski = get(store.showMinkowski);
	const chart = get(store.chart) as any;

	const canvasPosition = getRelativePosition(e, chart);
	let dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
	let dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

	dataX = Math.round(dataX * 10) / 10;
	dataY = Math.round(dataY * 10) / 10;

	chart.data.datasets.forEach((dataset: Chart.ChartDataSets) => {
		if (dataset.label != polygonIndex) return;
		store.polygons.update((p) => {
			const point = new Point(dataX, dataY);
			p[polygonIndex].addPoint(point);
			return p;
		});
		dataset.data = polygons[polygonIndex].getDrawable();
	});
	if (polygons.a.isEmpty() || polygons.b.isEmpty()) {
		chart.update('none');
		return;
	}

	const visiblePolygons = polygons;
	visiblePolygons['mDiff'] = new Polygon([]);
	store.chart.update((c: any) => {
		c.data.datasets[2].data = [];
		return c;
	});

	let mDiff = minkowskiDifference(polygons.a, polygons.b).getDrawable();
	mDiff = mDiff.map((point) => new Point(point.x, point.y));
	polygons['mDiff'] = new Polygon(mDiff as Point[]);
	store.chart.update((c: any) => {
		c.data.datasets[2].data = showMinkowski ? polygons['mDiff'].getDrawable() : [];
		return c;
	});

	setDimensions(chart.options.scales, chart.data.datasets);
	chart.update('none');
}

export function updateGJK() {
	const polygons = get(store.polygons);
	let currentState = get(store.gjkState);
	store.gjkState.update((gjkState) => {
		currentState = gjkState.next(polygons.a, polygons.b);
		return currentState;
	});
	store.chart.update((c: any) => {
		c.data.datasets[3].data = currentState.simplex.getDrawable();
		return c;
	});
}

export function showSubstate(index: number) {
	const gjkIndex = get(store.gjkIndex);
	const currentState = get(store.gjkStates)[gjkIndex];
	const subStateConfig = generateSubstateConfig(index, currentState);
	store.chart.update((c: any) => {
		c.data.datasets.push(subStateConfig);
		c.update('none');
		return c;
	});
}
