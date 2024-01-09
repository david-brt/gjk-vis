type Point = {
	x: number;
	y: number;
	color: string;
};
export function convexHull(points: Point[]): Point[] {
	if (points.length < 3) return points;

	const nextPoint = (current: Point, candidates: Point[]): Point => {
		let next = candidates[0];
		for (const candidate of candidates) {
			const cross = crossProduct(current, next, candidate);
			if (
				next === current ||
				cross > 0 ||
				(cross === 0 && distance(current, candidate) > distance(current, next))
			) {
				next = candidate;
			}
		}
		return next;
	};

	const start = points.reduce((min, point) => (point.x < min.x ? point : min), points[0]);
	let current = start;
	const hull: Point[] = [start];
	let next = nextPoint(current, points);

	while (next !== start) {
		hull.push(next);
		current = next;
		next = nextPoint(current, points);
	}

	return hull;
}

function distance(p1: Point, p2: Point): number {
	return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function crossProduct(o: Point, a: Point, b: Point): number {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

export function drawHull(ctx: CanvasRenderingContext2D, hull: Point[], color: string) {
	if (hull.length > 0) {
		ctx.beginPath();
		ctx.moveTo(hull[0].x, hull[0].y);
		for (let i = 1; i < hull.length; i++) {
			console.log(hull[i]);
			ctx.lineTo(hull[i].x, hull[i].y);
		}
		ctx.lineTo(hull[0].x, hull[0].y); // Close the hull
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}
