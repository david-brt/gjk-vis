<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import { selectedPolygon, showMinkowski } from '$lib/store';

	let minkowskiChecked = $showMinkowski;

	$: showMinkowski.set(minkowskiChecked);
</script>

<button on:click={() => selectedPolygon.set('a')}>polygon A</button>
<button on:click={() => selectedPolygon.set('b')}>polygon B</button>
<div class="checkbox-wrapper">
	<input type="checkbox" value="Show Minkowski Difference" bind:checked={minkowskiChecked} />
	<label for="showMinkowski">Show Minkowski Difference</label>
</div>

<Plot />
