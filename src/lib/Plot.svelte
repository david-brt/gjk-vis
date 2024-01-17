<script lang="ts">
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { getRelativePosition } from 'chart.js/helpers';

	let canvas: HTMLCanvasElement;
	let chart: any;

	const data = {
		labels: ['Expenses', 'Savings', 'Investments'],
		datasets: [
			{
				label: 'polygon 1',
				data: []
				// hoverOffset: 4,
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
				const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
				const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
				console.log(dataX, dataY);
			}
		}
	};
	onMount(() => {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		chart = new Chart(ctx, config);
	});
</script>

<div>
	<canvas bind:this={canvas} />
</div>
