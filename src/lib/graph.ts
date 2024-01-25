import { Polygon } from './polygon';

type PolygonMap = { [color: string]: Polygon };

export function setDimensions(scales: any, polygons: PolygonMap) {
	const bounds = Object.values(polygons)
		.flatMap((polygon) => polygon.points)
		.reduce(
			(acc, point) => ({
				x: { max: Math.max(point.x, acc.x.max), min: Math.min(point.x, acc.x.min) },
				y: { max: Math.max(point.y, acc.y.max), min: Math.min(point.y, acc.y.min) }
			}),
			{ x: { max: -Infinity, min: Infinity }, y: { max: -Infinity, min: Infinity } }
		);

	scales.x = {
		...scales.x,
		max: bounds.x.max + 0.1 * (bounds.x.max - bounds.x.min),
		min: bounds.x.min - 0.1 * (bounds.x.max - bounds.x.min)
	};
	scales.y = {
		...scales.y,
		max: bounds.y.max + 0.1 * (bounds.y.max - bounds.y.min),
		min: bounds.y.min - 0.1 * (bounds.y.max - bounds.y.min)
	};
}
