export class Point {
	x: number;
	y: number;

	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	negate() {
		return new Point(-this.x, -this.y);
	}

	equals(point: Point) {
		return this.x === point.x && this.y === point.y;
	}

	add(point: Point) {
		return new Point(this.x + point.x, this.y + point.y);
	}

	subtract(point: Point) {
		return new Point(this.x - point.x, this.y - point.y);
	}

	// returns the dot product with the given point
	dot(point: Point) {
		return this.x * point.x + this.y * point.y;
	}

	distance(p: Point): number {
		return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2);
	}
}
