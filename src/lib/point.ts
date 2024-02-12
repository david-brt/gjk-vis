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
		if (!this || !point) return this === point;
		return this.x === point.x && this.y === point.y;
	}

	// squared length of the vector
	length2() {
		return this.x * this.x + this.y * this.y;
	}

	add(point: Point) {
		return new Point(this.x + point.x, this.y + point.y);
	}

	subtract(point: Point) {
		return new Point(this.x - point.x, this.y - point.y);
	}

	multiplyScalar(scalar: number) {
		return new Point(this.x * scalar, this.y * scalar);
	}

	// returns the dot product with the given point
	dot(point: Point) {
		return this.x * point.x + this.y * point.y;
	}

	distance(p: Point): number {
		return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2);
	}
}
