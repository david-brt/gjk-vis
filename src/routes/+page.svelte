<script lang="ts">
	import { convexHull, drawHull } from '../lib/hull';
	type Point = {
		x: number;
		y: number;
		color: string;
	};

	let color: string = 'red';
	let points: Point[] = [];

	function handleMouseDown(event: MouseEvent): void {
		const rect = (event.target as HTMLElement).getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		points = [...points, { x, y, color }];
	}

	$: {
		if (typeof document !== 'undefined') {
			const canvas = document.querySelector('#myCanvas') as HTMLCanvasElement;
			const ctx = canvas.getContext('2d');
			if (ctx) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				points.forEach((point: Point) => {
					ctx.fillStyle = point.color;
					ctx.fillRect(point.x, point.y, 5, 5);
				});

				const groupedPoints = points.reduce(
					(groups, point) => {
						if (!groups[point.color]) groups[point.color] = [];
						groups[point.color].push(point);
						return groups;
					},
					{} as Record<string, Point[]>
				);

				for (const color in groupedPoints) {
					const hullPoints = convexHull(groupedPoints[color]);
					drawHull(ctx, hullPoints, color);
				}
			}
		}
	}
</script>

<button on:click={() => (color = 'red')}>Red</button>
<button on:click={() => (color = 'blue')}>Blue</button>
<canvas
	id="myCanvas"
	width="500"
	height="500"
	on:mousedown={handleMouseDown}
	style="border: 1px solid black"
></canvas>
