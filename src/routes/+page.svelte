<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import { selectedColor, showMinkowski } from '$lib/store';

	let minkowskiChecked = $showMinkowski;

	$: showMinkowski.set(minkowskiChecked);
</script>

<button on:click={() => selectedColor.set('red')}>Red</button>
<button on:click={() => selectedColor.set('blue')}>Blue</button>
<div class="checkbox-wrapper">
	<input type="checkbox" value="Show Minkowski Difference" bind:checked={minkowskiChecked} />
	<label for="showMinkowski">Show Minkowski Difference</label>
</div>

<Plot />
