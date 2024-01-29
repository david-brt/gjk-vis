export function setDimensions(scales: any, chartData: any) {
	const bounds = chartData
		.map((d: any) => d.data)
		.flatMap((polygon: any) => polygon)
		.reduce(
			(acc: any, point: any) => ({
				x: { max: Math.max(point.x, acc.x.max), min: Math.min(point.x, acc.x.min) },
				y: { max: Math.max(point.y, acc.y.max), min: Math.min(point.y, acc.y.min) }
			}),
			{ x: { max: -Infinity, min: Infinity }, y: { max: -Infinity, min: Infinity } }
		);

	const width = scales.x.max - scales.x.min;
	scales.x = {
		...scales.x,
		max: bounds.x.max + 0.1 * width,
		min: bounds.x.min - 0.1 * width
	};
	const height = scales.y.max - scales.y.min;
	scales.y = {
		...scales.y,
		max: bounds.y.max + 0.1 * height,
		min: bounds.y.min - 0.1 * height
	};
}
