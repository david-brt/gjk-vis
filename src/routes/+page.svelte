<script lang="ts">
	import Plot from '$lib/Plot.svelte';
	import { drawHull } from '$lib/hull';
	import { Point } from '$lib/point';
	import { Polygon } from '$lib/polygon';
	import { selectedColor } from '$lib/store';

	type PolygonMap = { [color: string]: Polygon };

	let color: string = 'red';
	let polygons: PolygonMap = { red: new Polygon(), blue: new Polygon() };

	function handleMouseDown(event: MouseEvent): void {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		polygons[color].points.push(new Point(x, y));
		draw();
	}

	function draw() {
		if (typeof document === 'undefined') {
			return;
		}
		const canvas = document.querySelector('#canv') as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		Object.keys(polygons).forEach((color: string) => {
			const polygon = polygons[color];
			const hullPoints = polygon.convexHull();
			drawHull(ctx, hullPoints, color);
			polygon.points.forEach((vertice: Point) => {
				ctx.fillStyle = color;
				ctx.fillRect(vertice.x, vertice.y, 5, 5);
			});
		});
	}
</script>

<button on:click={() => selectedColor.set('red')}>Red</button>
<button on:click={() => selectedColor.set('blue')}>Blue</button>
<canvas
	id="canv"
	width="500"
	height="500"
	on:mousedown={handleMouseDown}
	style="border: 1px solid black"
></canvas>

<Plot></Plot>
