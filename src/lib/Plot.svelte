<script lang="ts">
	import { onMount } from 'svelte';
	import { type ChartConfiguration } from 'chart.js';
	import Chart from 'chart.js/auto';
	import { getRelativePosition } from 'chart.js/helpers';

	let canvas: HTMLCanvasElement;
	let chart: any;

	const data = {
		labels: ['Expenses', 'Savings', 'Investments'],
		datasets: []
	};
	const config = {
		type: 'scatter',
		data: data,
		options: {
			scales: {
				x: {
					max: 100,
					min: -100,
					position: 'center'
				},
				y: {
					max: 100,
					min: -100,
					position: 'center'
				}
			},
			responsive: true,
			plugins: {
				legend: {
					position: 'bottom',
					display: true,
					labels: {
						usePointStyle: true,
						padding: 20,
						font: {
							size: 14
						}
					}
				}
			},
			onClick: (e: Event) => {
				const canvasPosition = getRelativePosition(e, chart);
				const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
				const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
				console.log(dataX, dataY);
			}
		}
	};
	onMount(() => {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		chart = new Chart(ctx, config as ChartConfiguration);
	});
</script>

<div>
	<canvas bind:this={canvas} />
</div>
