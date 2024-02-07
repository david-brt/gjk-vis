import { test, expect } from 'vitest';
import { gjk, GjkState } from '$lib/gjk';
import { Polygon } from '$lib/polygon';
import { Point } from '$lib/point';

test('gjk function', () => {
	const aPoints = [new Point(1, 1), new Point(2, 0), new Point(3, 5)];
	const bPoints = [new Point(0, 1), new Point(-5, 8), new Point(-3, -1)];
	const pa = new Polygon(aPoints);
	const pb = new Polygon(bPoints);

	const res = gjk(pa, pb);

	expect(res).toBe(1);
});

test('gjk class', () => {
	const aPoints = [new Point(1, 1), new Point(2, 0), new Point(3, 5)];
	const bPoints = [new Point(0, 1), new Point(-5, 8), new Point(-3, -1)];
	const pa = new Polygon(aPoints);
	const pb = new Polygon(bPoints);

	let state = new GjkState(pa, pb);

	while (!state.v.equals(state.vPrev)) {
		state = state.next(pa, pb);
	}

	expect(state.distance()).toBe(1);
});
