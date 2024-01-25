import { Point } from './point';
import { Polygon } from './polygon';

type PolygonMap = { [color: string]: Polygon };

export function setDimensions(scales: any, polygons: PolygonMap) {
	const max = new Point();
	const min = new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
	for (let [_, polygon] of Object.entries(polygons)) {
		console.log(polygon);
		const currMax = polygon.points.reduce((max, point) => {
			max.x = Math.max(point.x, max.x);
			max.y = Math.max(point.y, max.y);
			return max;
		}, new Point());

		const currMin = polygon.points.reduce(
			(min, point) => {
				min.x = Math.min(point.x, min.x);
				min.y = Math.min(point.y, min.y);
				return min;
			},
			new Point(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
		);

		max.x = Math.max(currMax.x, max.x);
		max.y = Math.max(currMax.y, max.y);
		min.x = Math.min(currMin.x, min.x);
		min.y = Math.min(currMin.y, min.y);
	}
	scales.x.max = max.x + 0.1 * (max.x - min.x);
	scales.x.min = min.x - 0.1 * (max.x - min.x);
	scales.y.max = max.y + 0.1 * (max.y - min.y);
	scales.y.min = min.y - 0.1 * (max.y - min.y);
}
