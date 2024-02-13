<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import * as store from '$lib/store';
	import { GjkState } from '$lib/gjk';
	const { chart, gjkState, gjkStates, gjkIndex, polygons, showMinkowski } = store;

	let minkowskiChecked = $showMinkowski;
	let validPolygons = false;

	$: validPolygons = $polygons.a.points.length > 2 && $polygons.b.points.length > 2;
	$: store.showMinkowski.set(minkowskiChecked);

	function initializeGjk() {
		gjkState.set(new GjkState($polygons.a, $polygons.b));
		gjkStates.set($gjkState.execute($polygons.a, $polygons.b));
		store.chart.update((c: any) => {
			c.data.datasets[2].backgroundColor = 'rgba(255, 209, 102, 0.3)';
			c.data.datasets[2].borderColor = 'rgba(255, 209, 102, 0.3)';
			return c;
		});
		$chart.update('none');
		gjkIndex.set(0);
		minkowskiChecked = true;
	}

	function handleGjkStep() {
		store.chart.update((c: any) => {
			gjkIndex.update((i: number) => i + 1);
			const newState = $gjkStates[$gjkIndex];
			gjkState.set(newState);
			c.data.datasets[3].data = newState.simplex.getDrawable();
			return c;
		});
		$chart.update('none');
	}
</script>

{#if $gjkState.i >= 0}
	<button on:click={handleGjkStep}>GJK Step</button>
{/if}
{#if $gjkState.i === -1}
	<button on:click={() => store.selectedPolygon.set('a')}>polygon A</button>
	<button on:click={() => store.selectedPolygon.set('b')}>polygon B</button>
	<div class="checkbox-wrapper">
		<input type="checkbox" value="Show Minkowski Difference" bind:checked={minkowskiChecked} />
		<label for="showMinkowski">Show Minkowski Difference</label>
	</div>
{/if}
{#if $gjkState.i === -1 && validPolygons}
	<button on:click={initializeGjk}>Start GJK algorithm </button>
{/if}

<Plot />
