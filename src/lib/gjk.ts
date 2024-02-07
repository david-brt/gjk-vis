import { Polygon } from './polygon';
import { Point } from './point';

export class GjkState {
	a = new Point();
	b = new Point();
	v = new Point();
	closestPoint = new Point();
	closestFace = [] as Point[];
	vPrev = new Point();
	simplex = [] as Point[];
	support = new Point();

	constructor(pa?: Polygon, pb?: Polygon) {
		if (!pa || !pb) return;
		this.a = pa.hullPoints[1];
		this.b = pb.hullPoints[1];
		this.v = this.a.subtract(this.b);
		this.closestPoint = new Point();
		this.closestFace = [new Point(Infinity), new Point(Infinity)];
		this.vPrev = new Point(Infinity, Infinity);
		this.simplex = [this.v];
	}

	next(pa: Polygon, pb: Polygon) {
		const nextState = new GjkState(pa, pb);
		nextState.support = supportMinkowski(pa, pb, this.v.negate());
		nextState.vPrev = this.v;
		nextState.simplex.push(nextState.support);
		const closest = distanceSub(nextState.simplex);
		nextState.closestFace = closest.closestFace;
		nextState.closestPoint = closest.closestPoint;
		nextState.simplex = nextState.closestFace;
		nextState.v = closest.closestPoint;
		return nextState;
	}

	distance() {
		const closest = closestPointInSimplex(this.simplex, new Point());
		return distance(closest.closestPoint, new Point());
	}
}

export function gjk(pa: Polygon, pb: Polygon) {
	let a = pa.hullPoints[1];
	let b = pb.hullPoints[1];
	let v = a.subtract(b);
	let vPrev = new Point(Infinity, Infinity);
	let simplex = [v];
	while (!v.equals(vPrev)) {
		const support = supportMinkowski(pa, pb, v.negate());
		vPrev = v;
		simplex.push(support);
		const closest = distanceSub(simplex);
		const { closestFace } = closest;
		simplex = closestFace;
		v = closest.closestPoint;
	}
	const closest = closestPointInSimplex(simplex, new Point());
	return distance(closest.closestPoint, new Point());
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
	let closestPoint = new Point();
	let closestFace = [] as Point[];
	for (let i = 0; i < points.length; i++) {
		const a = points[i];
		const b = points[(i + 1) % points.length];
		const c = closestPointFromLine(a, b, v);
		if (distance2(c, v) < min) {
			min = distance2(c, v);
			closestPoint = c;
			closestFace = [a, b];
		}
	}
	return {
		closestPoint,
		closestFace
	};
}

function distance2(a: Point, b: Point) {
	return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

function distance(a: Point, b: Point) {
	return Math.sqrt(distance2(a, b));
}

/**
 * more information on https://stackoverflow.com/questions/3120357/get-closest-point-to-a-line
 */

function closestPointFromLine(a: Point, b: Point, p: Point) {
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
