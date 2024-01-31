import { Polygon } from './polygon';
import { Point } from './point';

export function gjk(pa: Polygon, pb: Polygon) {
	let a = pa.hullPoints[1];
	let b = pb.hullPoints[1];
	let v = a.subtract(b);
	console.log(v);
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

function closestPointInSimplex(points: Point[], v: Point) {
	let min = Infinity;
	let closestPoint = new Point();
	let closestFace = [] as Point[];
	for (let i = 0; i < points.length; i++) {
		const a = points[i];
		const b = points[(i + 1) % points.length];
		const c = closestPointFromLine2(a, b, v);
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
	if (a.equals(b)) {
		return a;
	}

	const a_to_p = new Point(p.x - a.x, p.y - a.y);
	const a_to_b = new Point(b.x - a.x, b.y - a.y);

	const atb2 = a_to_b.x ** 2 + a_to_b.y ** 2;
	const atp_dot_atb = a_to_p.x * a_to_b.x + a_to_p.y * a_to_b.y;
	const t = atp_dot_atb / atb2;

	return new Point(a.x + a_to_b.x * t, a.y + a_to_b.y * t);
}

function closestPointFromLine2(a: Point, b: Point, p: Point) {
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
