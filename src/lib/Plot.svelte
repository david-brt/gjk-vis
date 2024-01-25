<script lang="ts">
	import { onMount } from 'svelte';
	import AutoChart from 'chart.js/auto';
	import { getRelativePosition } from 'chart.js/helpers';
	import { polygons, selectedColor } from '$lib/store';
	import { Point } from './point';
	import { Polygon, minkowskiDifference } from './polygon';

	let canvas: HTMLCanvasElement;
	let chart: any;

	const data: Chart.ChartData = {
		datasets: [
			{
				label: 'blue',
				data: [],
				showLine: true
			},
			{
				label: 'red',
				data: [],
				showLine: true
			},
			{
				label: 'minkowski difference',
				data: [],
				showLine: true
			}
		]
	};

	const config: any = {
		type: 'scatter',
		data: data,
		options: {
			aspectRatio: 1,
			scales: {
				x: {
					max: 100,
					min: -100,
					position: { y: 0 },
					ticks: {
						stepSize: 10
					}
				},
				y: {
					max: 100,
					min: -100,
					position: { x: 0 },
					ticks: {
						stepSize: 10
					}
				}
			},
			responsive: true,
			plugins: {
				legend: {
					display: false
				}
			},
			onClick: (e: Event) => {
				const canvasPosition = getRelativePosition(e, chart);
				const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
				const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
				console.log(chart.data.datasets);
				chart.data.datasets.forEach((dataset: Chart.ChartDataSets) => {
					const color = $selectedColor;
					if (dataset.label != color) return;
					// update store
					polygons.update((p) => {
						const point = new Point(dataX, dataY);
						p[color] ? p[color].addPoint(point) : (p[color] = new Polygon([point]));
						return p;
					});
					// update chart
					dataset.data = $polygons[color].getDrawable();
				});
				if ($polygons['red'] === undefined || $polygons['blue'] === undefined) {
					chart.update('none');
					return;
				}
				let mDiff = minkowskiDifference($polygons['red'], $polygons['blue']).getDrawable();
				chart.data.datasets[2].data = mDiff;
				mDiff = mDiff.map((point) => new Point(point.x, point.y));
				$polygons['mDiff'] = new Polygon(mDiff as Point[]);
				setDimensions(chart.options.scales, $polygons);
				chart.update('none');
			}
		}
	};
	onMount(() => {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		chart = new AutoChart(ctx, config);
	});

	type PolygonMap = { [color: string]: Polygon };

	function setDimensions(scales: any, polygons: PolygonMap) {
		const max = new Point();
		const min = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
		for (let [_, polygon] of Object.entries(polygons)) {
			console.log(polygon);
			const currMax = polygon.points.reduce((max, point) => {
				max.x = Math.max(point.x, max.x);
				max.y = Math.max(point.y, max.y);
				return max;
			}, new Point());

			const currMin = polygon.points.reduce(
				(min, point) => {
					min.x = Math.min(point.x, min.x);
					min.y = Math.min(point.y, min.y);
					return min;
				},
				new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
			);

			max.x = Math.max(currMax.x, max.x);
			max.y = Math.max(currMax.y, max.y);
			min.x = Math.min(currMin.x, min.x);
			min.y = Math.min(currMin.y, min.y);
		}
		scales.x.max = max.x + 0.1 * (max.x - min.x);
		scales.x.min = min.x - 0.1 * (max.x - min.x);
		scales.y.max = max.y + 0.1 * (max.y - min.y);
		scales.y.min = min.y - 0.1 * (max.y - min.y);
	}
</script>

<div class="plot-container">
	<canvas bind:this={canvas} />
</div>

<style>
	.plot-container {
		padding: 0 20%;
	}
</style>
