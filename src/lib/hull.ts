import { Point } from './point';

export function drawHull(ctx: CanvasRenderingContext2D, hull: Point[], color: string) {
	if (hull.length > 0) {
		ctx.beginPath();
		ctx.moveTo(hull[0].x, hull[0].y);
		for (let i = 1; i < hull.length; i++) {
			ctx.lineTo(hull[i].x, hull[i].y);
		}
		ctx.lineTo(hull[0].x, hull[0].y); // Close the hull
		ctx.strokeStyle = color;
		ctx.stroke();
	}
}
