import { test, expect } from 'vitest';
import { gjk } from '$lib/gjk';
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
