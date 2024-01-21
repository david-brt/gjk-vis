import { Point } from './point';

export class Polygon {
	points: Point[];
	// convex hull of the given points
	hullPoints: Point[];

	constructor(points = []) {
		this.points = points;
		this.hullPoints = convexHull(points);
	}

	addPoint(point: Point) {
		this.points.push(point);
		sort(this.points);
		this.hullPoints = convexHull(this.points);
	}
}

/**
 * sorts the convex hull by its polar coordinates
 * makes the polygon easily drawable
 */
function sort(points: Point[]) {
	const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
	const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

	const center = new Point(centerX, centerY);

	// Sort by polar angle and distance, centered at this center of mass.
	points.sort((a, b) => {
		const apol = squaredPolar(a, center);
		const bpol = squaredPolar(b, center);
		return apol.angle - bpol.angle || apol.distance2 - bpol.distance2;
	});
}

function squaredPolar(point: Point, center: Point) {
	return {
		angle: Math.atan2(point.y - center.y, point.x - center.x),
		distance2: (point.x - center.x) ** 2 + (point.y - center.y) ** 2
	};
}

function crossProduct(o: Point, a: Point, b: Point): number {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

function convexHull(points: Point[]): Point[] {
	if (points.length <= 3) return points;

	const nextPoint = (current: Point, candidates: Point[]): Point => {
		let next = candidates[0];
		for (const candidate of candidates) {
			const cross = crossProduct(current, next, candidate);
			if (
				next === current ||
				cross > 0 ||
				(cross === 0 && current.distance(candidate) > current.distance(next))
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
