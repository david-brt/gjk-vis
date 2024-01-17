<script lang="ts">
	import { onMount } from 'svelte';
	import AutoChart from 'chart.js/auto';
	import { Chart } from 'chart.js';
	import { getRelativePosition } from 'chart.js/helpers';

	let canvas: HTMLCanvasElement;
	let chart: any;

	const data: Chart.ChartData = {
		labels: ['Expenses', 'Savings', 'Investments'],
		datasets: [
			{
				label: 'polygon 1',
				data: []
			},
			{
				label: 'polygon 2',
				data: []
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
				const dataX: number = chart.scales.x.getValueForPixel(canvasPosition.x);
				const dataY: number = chart.scales.y.getValueForPixel(canvasPosition.y);
				chart.data.datasets.forEach((dataset: Chart.ChartDataSets) => {
					if (dataset.label != 'polygon 1') return;
					console.log(dataset);
					dataset.data && dataset.data.push({ x: dataX, y: dataY });
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
