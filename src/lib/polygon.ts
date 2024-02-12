import { Point } from './point';
import { closestPointFromLine, distance2 } from '$lib/gjk';

export class Polygon {
	points: Point[];
	// convex hull of the given points
	hullPoints: Point[];

	constructor(points: Point[] = []) {
		this.points = points;
		this.hullPoints = convexHull(points);
	}

	set(a: Point[]) {
		this.points = a;
		this.hullPoints = convexHull(a);
	}

	isEmpty() {
		return this.hullPoints.length === 0;
	}

	/**
	 * adds point to the polygon, sorts the points and recalculates the convex hull
	 */
	addPoint(point: Point) {
		this.points.push(point);
		sort(this.points);
		this.hullPoints = convexHull(this.points);
	}

	getDrawable() {
		const points = this.hullPoints.map((p: Point) => {
			return { x: p.x, y: p.y };
		});
		points.push(points[0]);
		return points;
	}

	closestEdgeToOrigin() {
		let minDistance = Infinity;
		let closestEdge = [new Point(), new Point()];
		const origin = new Point();
		for (let i = 0; i < this.hullPoints.length; i++) {
			let a = this.hullPoints[i];
			let b = this.hullPoints[(i + 1) % this.hullPoints.length];
			const edge = [a, b];
			const closestPoint = closestPointFromLine(a, b, origin);
			const distance = distance2(closestPoint, origin);
			if (distance < minDistance) {
				minDistance = distance;
				closestEdge = edge;
			}
		}
		return closestEdge;
	}
}

export function minkowskiDifference(pa: Polygon, pb: Polygon) {
	const diff = new Polygon();
	if (pa.hullPoints.length == 0 || pb.hullPoints.length == 0) {
		return diff;
	}

	for (let a of pa.hullPoints) {
		for (let b of pb.hullPoints) {
			diff.points.push(a.subtract(b));
		}
	}
	sort(diff.points);
	diff.hullPoints = convexHull(diff.points);
	return diff;
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

export type GJKPolygons = {
	a: Polygon;
	b: Polygon;
	mDiff: Polygon;
};
