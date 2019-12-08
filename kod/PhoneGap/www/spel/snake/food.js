class Food {
	constructor(rangex, rangey, color) {
		this.x = floor(random(rangex));
		this.y = floor(random(rangey));
		this.size = 1;
		this.c = color;
	}

	show() {
		var edge_indent = -0.01; //same as snake.js
		fill(this.c);
		rect(this.x + edge_indent / 2, this.y + edge_indent / 2, this.size - edge_indent, this.size - edge_indent);
	}
}
