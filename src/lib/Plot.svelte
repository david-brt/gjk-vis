<script lang="ts">
	import { onMount } from 'svelte';
	import AutoChart from 'chart.js/auto';
	import { polygons, showMinkowski, chart } from '$lib/store';
	import { setDimensions } from './chart/scales';
	import { data } from './chartData';
	import { updatePolygons } from './chart/update';

	let canvas: HTMLCanvasElement;

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
				updatePolygons(e);
			}
		}
	};

	function toggleMinkowski(showMinkowski: boolean) {
		if (!$chart || !$polygons.mDiff) return;

		const mDiffPoints = $polygons.mDiff.getDrawable();
		chart.update((chart: any) => {
			chart.data.datasets[2].data = showMinkowski ? mDiffPoints : [];
			return chart;
		});
		setDimensions($chart.options.scales, $chart.data.datasets);
		$chart.update('none');
	}

	onMount(() => {
		const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
		chart.set(new AutoChart(ctx, config));
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
