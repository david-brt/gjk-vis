import { Polygon } from './polygon';
import { Point } from './point';

export class GjkState {
	i = 0;
	v = new Point();
	closestPoint = new Point();
	closestFace = new Polygon();
	vPrev = new Point();
	simplex = new Polygon();
	support = new Point();

	constructor(pa?: Polygon, pb?: Polygon) {
		if (!pa || !pb) return;
		this.v = supportMinkowski(pa, pb, new Point(1, 0));
		this.closestPoint = new Point();
		this.closestFace = new Polygon([new Point(Infinity), new Point(Infinity)]);
		this.vPrev = new Point(Infinity, Infinity);
		this.simplex = new Polygon([this.v]);
	}

	next(pa: Polygon, pb: Polygon) {
		const nextState = new GjkState(pa, pb);
		nextState.i = this.i + 1;
		nextState.support = supportMinkowski(pa, pb, this.v.negate());
		nextState.vPrev = this.v;
		nextState.simplex = this.simplex;
		nextState.simplex.addPoint(nextState.support);
		const closest = distanceSub(nextState.simplex.points);
		nextState.closestFace.set(nextState.simplex.closestEdgeToOrigin());
		nextState.closestPoint = closest;
		nextState.simplex.set(nextState.closestFace.points);
		nextState.v = closest;
		return nextState;
	}

	distance() {
		const closest = closestPointInSimplex(this.simplex.points, new Point());
		return distance(closest, new Point());
	}
}

function supportMinkowski(pa: Polygon, pb: Polygon, d: Point) {
	const supportA = support(pa, d);
	const supportB = support(pb, d.negate());
	return supportA.subtract(supportB);
}

function support(p: Polygon, v: Point) {
	let res = new Point();
	p.hullPoints.reduce((max, point) => {
		if (point.dot(v) > max) {
			res = point;
			return point.dot(v);
		}
		return max;
	}, -Infinity);
	return res;
}

function distanceSub(points: Point[]) {
	const o = new Point();
	return closestPointInSimplex(points, o);
}

export function closestPointInSimplex(points: Point[], v: Point) {
	let min = Infinity;
	let closest = new Point();
	for (let i = 0; i < points.length; i++) {
		const a = points[i];
		const b = points[(i + 1) % points.length];
		const c = closestPointFromLine(a, b, v);
		if (distance2(c, v) < min) {
			min = distance2(c, v);
			closest = c;
		}
	}
	return closest;
}

export function distance2(a: Point, b: Point) {
	return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function distance(a: Point, b: Point) {
	return Math.sqrt(distance2(a, b));
}

export function closestPointFromLine(a: Point, b: Point, p: Point) {
	const ap = p.subtract(a);
	const ab = b.subtract(a);

	const magnitudeAB = ab.length2();
	const abapProduct = ap.dot(ab);
	const distance = abapProduct / magnitudeAB;

	if (distance >= 0 && distance <= 1) {
		return a.add(ab.multiplyScalar(distance));
	}
	if (distance < 0) {
		return a;
	}
	return b;
}
