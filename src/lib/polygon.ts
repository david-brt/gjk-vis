import { Point } from './point';

export class Polygon {
	points: Point[];

	constructor(points: Point[] = []) {
		this.points = points;
	}

	convexHull(): Point[] {
		if (this.points.length <= 3) return this.points;

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

		const start = this.points.reduce(
			(min, point) => (point.x < min.x ? point : min),
			this.points[0]
		);
		let current = start;
		const hull: Point[] = [start];
		let next = nextPoint(current, this.points);

		while (next !== start) {
			hull.push(next);
			current = next;
			next = nextPoint(current, this.points);
		}

		return hull;
	}
}

function crossProduct(o: Point, a: Point, b: Point): number {
	return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}
