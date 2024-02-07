<script lang="ts">
	import { onMount } from 'svelte';
	import AutoChart from 'chart.js/auto';
	import { polygons, showMinkowski } from '$lib/store';
	import { setDimensions } from './chart/scales';
	import { data } from './chartData';
	import { updateChart } from './chart/update';

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
				updateChart(e, chart);
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

	$: toggleMinkowski($showMinkowski);
</script>

<div class="plot-container">
	<canvas bind:this={canvas} />
</div>

<style>
	.plot-container {
		padding: 0 20%;
	}
</style>
