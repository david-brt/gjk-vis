<script lang="ts">
	import { convexHull, drawHull } from '../lib/hull';
	import { Point } from '../lib/point';

	type Polygon = { [color: string]: Point[] };

	let color: string = 'red';
	let polygons: Polygon = { red: [], blue: [] };

	function handleMouseDown(event: MouseEvent): void {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		polygons[color].push(new Point(x, y));
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
			const vertices = polygons[color];
			const hullPoints = convexHull(vertices);
			drawHull(ctx, hullPoints, color);
			vertices.forEach((vertice: Point) => {
				ctx.fillStyle = color;
				ctx.fillRect(vertice.x, vertice.y, 5, 5);
			});
		});
	}
</script>

<button on:click={() => (color = 'red')}>Red</button>
<button on:click={() => (color = 'blue')}>Blue</button>
<canvas
	id="canv"
	width="500"
	height="500"
	on:mousedown={handleMouseDown}
	style="border: 1px solid black"
></canvas>
