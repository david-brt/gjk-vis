import { PUBLIC_INITIAL_SCALE } from '$env/static/public';

export function setDimensions(scales: any, chartData: any) {
	const bounds = chartData
		.map((d: any) => d.data)
		.flatMap((polygon: any) => polygon)
		.filter((point: any) => point)
		.reduce(
			(acc: any, point: any) => ({
				x: { max: Math.max(point.x, acc.x.max), min: Math.min(point.x, acc.x.min) },
				y: { max: Math.max(point.y, acc.y.max), min: Math.min(point.y, acc.y.min) }
			}),
			{ x: { max: -Infinity, min: Infinity }, y: { max: -Infinity, min: Infinity } }
		);

	const width = scales.x.max - scales.x.min;

	const initialMax = parseInt(PUBLIC_INITIAL_SCALE) / 2;
	const initialMin = (-1 * parseInt(PUBLIC_INITIAL_SCALE)) / 2;

	scales.x = {
		...scales.x,
		max: Math.max(bounds.x.max + 0.1 * width, initialMax),
		min: Math.min(bounds.x.min - 0.1 * width, initialMin)
	};
	const height = scales.y.max - scales.y.min;
	scales.y = {
		...scales.y,
		max: Math.max(bounds.y.max + 0.1 * height, initialMax),
		min: Math.min(bounds.y.min - 0.1 * height, initialMin)
	};
}
