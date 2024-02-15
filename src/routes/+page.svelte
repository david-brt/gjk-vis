<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import { GjkState } from '$lib/gjk';
	import { showSubstate } from '$lib/chart/update';
	import { get } from 'svelte/store';
	import * as store from '$lib/store';

	const { gjkState, gjkStates, gjkIndex, polygons, showMinkowski } = store;

	let minkowskiChecked = $showMinkowski;
	let validPolygons = false;
	let subState = -1;

	$: validPolygons = $polygons.a.points.length > 2 && $polygons.b.points.length > 2;
	$: store.showMinkowski.set(minkowskiChecked);

	function initializeGjk() {
		const chart = get(store.chart);
		gjkState.set(new GjkState($polygons.a, $polygons.b));
		gjkStates.set($gjkState.execute($polygons.a, $polygons.b));
		store.chart.update((c: any) => {
			c.data.datasets[2].backgroundColor = 'rgba(255, 209, 102, 0.15)';
			c.data.datasets[2].borderColor = 'rgba(255, 209, 102, 0.15)';
			return c;
		});
		chart.update('none');
		gjkIndex.set(0);
		minkowskiChecked = true;
	}

	function handleGjkStep() {
		const chart = get(store.chart);
		if ($gjkIndex >= $gjkStates.length) return;
		const subStateCount = 2;
		subState = (subState + 1) % subStateCount;
		showSubstate(subState);
		chart.update('none');
		if (subState === subStateCount - 1) {
			gjkIndex.update((i) => i + 1);
		}
	}
</script>

{#if $gjkIndex >= 0}
	<button on:click={handleGjkStep}>GJK Step</button>
{/if}
{#if $gjkIndex === -1}
	<button on:click={() => store.selectedPolygon.set('a')}>polygon A</button>
	<button on:click={() => store.selectedPolygon.set('b')}>polygon B</button>
	<div class="checkbox-wrapper">
		<input type="checkbox" value="Show Minkowski Difference" bind:checked={minkowskiChecked} />
		<label for="showMinkowski">Show Minkowski Difference</label>
	</div>
{/if}
{#if $gjkIndex === -1 && validPolygons}
	<button on:click={initializeGjk}>Start GJK algorithm </button>
{/if}

<Plot />
