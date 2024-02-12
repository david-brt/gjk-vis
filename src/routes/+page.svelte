<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import * as store from '$lib/store';
	import { GjkState } from '$lib/gjk';
	const { chart, gjkState, polygons, showMinkowski } = store;

	let minkowskiChecked = $showMinkowski;

	$: store.showMinkowski.set(minkowskiChecked);

	function handleGjkStep() {
		if ($gjkState.v.equals($gjkState.vPrev))
			if ($gjkState.i === 0) {
				gjkState.set(new GjkState($polygons.a, $polygons.b));
			}
		store.chart.update((c: any) => {
			const newState = $gjkState.next($polygons.a, $polygons.b);
			gjkState.set(newState);
			c.data.datasets[3].data = newState.simplex.getDrawable();
			return c;
		});
		$chart.update('none');
	}
</script>

<button on:click={() => store.selectedPolygon.set('a')}>polygon A</button>
<button on:click={() => store.selectedPolygon.set('b')}>polygon B</button>
<button on:click={handleGjkStep}>GJK Step</button>
<div class="checkbox-wrapper">
	<input type="checkbox" value="Show Minkowski Difference" bind:checked={minkowskiChecked} />
	<label for="showMinkowski">Show Minkowski Difference</label>
</div>

<Plot />
