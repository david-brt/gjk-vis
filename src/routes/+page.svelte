<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import { selectedColor } from '$lib/store';

	let showMinkowski = true;
</script>

<button on:click={() => selectedColor.set('red')}>Red</button>
<button on:click={() => selectedColor.set('blue')}>Blue</button>
<div class="checkbox-wrapper">
	<input type="checkbox" value="Show Minkowski Difference" bind:checked={showMinkowski} />
	<label for="showMinkowski">Show Minkowski Difference</label>
</div>

<Plot bind:showMinkowski></Plot>
