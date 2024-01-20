<script lang="ts">
	import { onMount } from 'svelte';
	import AutoChart from 'chart.js/auto';
	import { getRelativePosition } from 'chart.js/helpers';
	import { polygons, selectedColor } from '$lib/store';
	import { Point } from './point';

	let canvas: HTMLCanvasElement;
	let chart: any;

	const data: Chart.ChartData = {
		datasets: [
			{
				label: 'blue',
				data: $polygons['blue']
			},
			{
				label: 'red',
				data: $polygons['red']
			}
		]
	};

	const drawing = {
		afterDraw(chart, args, options) {
			const { ctx } = chart;
			ctx.save();
			ctx.beginPath();
		}
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
					position: 'center',
					ticks: {
						stepSize: 10
					}
				},
				y: {
					max: 100,
					min: -100,
					position: 'center',
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
				chart.data.datasets.forEach((dataset: Chart.ChartDataSets) => {
					const color = $selectedColor;
					if (dataset.label != color) return;
					(dataset.data as { x: number; y: number }[]).push({ x: dataX, y: dataY });
					polygons.update((p) => {
						const point = new Point(dataX, dataY);
						p[color] ? p[color].push(point) : (p[color] = [point]);
						return p;
					});
					chart.update('none');
				});
			}
		}
	};
	onMount(() => {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		chart = new AutoChart(ctx, config);
	});
</script>

<div class="plot-container">
	<canvas bind:this={canvas} />
</div>

<style>
	.plot-container {
		padding: 0 20%;
	}
</style>
