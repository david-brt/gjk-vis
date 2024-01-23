<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import { selectedColor } from '$lib/store';
</script>

<button on:click={() => selectedColor.set('red')}>Red</button>
<button on:click={() => selectedColor.set('blue')}>Blue</button>

<Plot></Plot>
