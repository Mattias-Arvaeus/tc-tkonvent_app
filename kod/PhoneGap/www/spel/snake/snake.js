class Snake {
	constructor(x, y, boundaries) {
		this.body = [];
		this.body.push(createVector(x, y)); // create head
		this.size = 1;
		this.dir = createVector(0, 0);
		this.c_head = color(0, 225, 0);
		this.c_body = color(0, 155, 0);
		this.boundaries = boundaries;
		this.alive = true;

		this.rainbow_len = 25;
		this.rainbow = new Rainbow();

		// fill rainbow with rainbows
		for (var i = 0; i < (w * h) / this.rainbow_len; i++) {
			var r = new Rainbow(this.rainbow_len);
			this.rainbow.colors.push(...r.colors);
		}

		this.start_tune = new Audio("resources/audio/start-tune.mp3");
		this.die_tune = new Audio("resources/audio/end-tune.mp3");

		// mobile controls using hammerjs lib
		this.canvas_container_element = document.getElementById("canvas-container");
		this.hammer = new Hammer(this.canvas_container_element); // create hammer object to handle swipes
		this.hammer.get("swipe").set({ direction: Hammer.DIRECTION_ALL }); // enable vertical swipes
	}

	did_eat(pos) {
		if (this.body[0].x == pos.x && this.body[0].y == pos.y) {
			return true;
		}
		return false;
	}

	die() {
		this.alive = false;
		this.set_dir("none");
		this.die_tune.play();
		console.log("score: " + (this.body.length - 1));

		this.die_sequence = false;
	}

	set_dir(dir) {
		switch (dir) {
			case "up":
				if (this.body.length === 1) {
					this.dir.set(0, -1);
				}
				// if snake is not going down
				else if (this.body[0].y !== this.body[1].y + this.size) {
					this.dir.set(0, -1);
				}
				break;
			case "down":
				if (this.body.length === 1) {
					this.dir.set(0, 1);
				}
				// if snake is not going up
				else if (this.body[0].y !== this.body[1].y - this.size) {
					this.dir.set(0, 1);
				}
				break;
			case "left":
				if (this.body.length === 1) {
					this.dir.set(-1, 0);
				}
				// if snake is not going right
				else if (this.body[0].x !== this.body[1].x + this.size) {
					this.dir.set(-1, 0);
				}
				break;
			case "right":
				if (this.body.length === 1) {
					this.dir.set(1, 0);
				}
				// if snake is not going left
				else if (this.body[0].x !== this.body[1].x - this.size) {
					this.dir.set(1, 0);
				}
				break;
			case "none":
				this.dir.x = 0;
				this.dir.y = 0;
				break;
		}
	}

	input() {
		this.hammer.on("swipeup", function() {
			snake.set_dir("up");
		});
		this.hammer.on("swipedown", function() {
			snake.set_dir("down");
		});
		this.hammer.on("swipeleft", function() {
			snake.set_dir("left");
		});
		this.hammer.on("swiperight", function() {
			snake.set_dir("right");
		});
	}

	update() {
		// make copy of tail
		var temp = this.body[this.body.length - 1].copy();

		// place copy of head at tail and move to direction
		temp.x = this.body[0].x + this.dir.x;
		temp.y = this.body[0].y + this.dir.y;

		// use temp to predict next pos and check collision
		if (temp.x < this.boundaries.xmin || temp.x + this.size > this.boundaries.xmax) {
			this.die();
		}
		if (temp.y < this.boundaries.ymin || temp.y + this.size > this.boundaries.ymax) {
			this.die();
		}
		// self hit
		for (var b = 1; b < this.body.length; b++) {
			if (temp.x == this.body[b].x && temp.y == this.body[b].y) {
				this.die();
			}
		}

		if (this.alive) {
			// add tail copy to front of array
			this.body.unshift(temp);

			// remove real tail
			this.body.pop();
		}
	}

	show() {
		var edge_indent = -0.01; //pieces overlap = no ugly borders inside this

		for (var [index, b] of this.body.entries()) {
			fill(this.rainbow.colors[index]);

			rect(b.x + edge_indent / 2, b.y + edge_indent / 2, this.size - edge_indent, this.size - edge_indent);
		}
	}
}
