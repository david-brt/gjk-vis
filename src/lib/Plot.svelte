<script lang="ts">
	import { onMount } from 'svelte';
	import AutoChart from 'chart.js/auto';
	import { getRelativePosition } from 'chart.js/helpers';
	import { polygons, selectedColor } from '$lib/store';
	import { Point } from './point';
	import { Polygon, minkowskiDifference } from './polygon';
	import { setDimensions } from './graph';
	import { data } from './chartData';

	export let showMinkowski: boolean;

	let canvas: HTMLCanvasElement;
	let chart: any;

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
				let dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
				let dataY = chart.scales.y.getValueForPixel(canvasPosition.y);

				dataX = Math.round(dataX * 10) / 10;
				dataY = Math.round(dataY * 10) / 10;

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

				const visiblePolygons = $polygons;
				visiblePolygons['mDiff'] = new Polygon([]);
				chart.data.datasets[2].data = [];

				let mDiff = minkowskiDifference($polygons['red'], $polygons['blue']).getDrawable();
				mDiff = mDiff.map((point) => new Point(point.x, point.y));
				$polygons['mDiff'] = new Polygon(mDiff as Point[]);
				chart.data.datasets[2].data = showMinkowski ? $polygons['mDiff'].getDrawable() : [];

				setDimensions(chart.options.scales, chart.data.datasets);
				chart.update('none');
			}
		}
	};

	function toggleMinkowski(showMinkowski: boolean) {
		if (!chart || !$polygons['mDiff']) return;

		chart.data.datasets[2].data = showMinkowski ? $polygons['mDiff'].getDrawable() : [];
		setDimensions(chart.options.scales, chart.data.datasets);
		chart.update('none');
	}

	onMount(() => {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		chart = new AutoChart(ctx, config);
	});

	$: toggleMinkowski(showMinkowski);
</script>

<div class="plot-container">
	<canvas bind:this={canvas} />
</div>

<style>
	.plot-container {
		padding: 0 20%;
	}
</style>
