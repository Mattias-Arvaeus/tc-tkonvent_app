const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const w = 17; // pixels
let h = w * 4;
const fps = 8;
const pixel_size = vw / w;
let setting_height = true;
while (setting_height) {
	if (h * pixel_size > vh) {
		h--;
	} else {
		setting_height = false;
	}
}
console.log("setting canvas height (pixels) to " + h);
let snake;
let food;
let boundaries = { xmin: 0, xmax: w, ymin: 0, ymax: h };
let start_tune = new Audio("resources/audio/start-tune.mp3");
let eat_tune = new Audio("resources/audio/eat-tune.mp3");

function new_food(body) {
	let placing_food = true;
	let food_on_body = false;
	while (placing_food) {
		food = new Food(w, h, snake.rainbow.colors[snake.body.length]);
		for (var b of body) {
			if (food.x === b.x && food.y === b.y) {
				food_on_body = true;
				break;
			} else {
				food_on_body = false;
			}
		}
		if (!food_on_body) {
			placing_food = false;
		}
	}
}

function setup() {
	createCanvas(w * pixel_size, h * pixel_size);
	screen.orientation.lock("portrait");
	frameRate(fps);

	snake = new Snake(floor(w / 2), floor(h / 2), boundaries);
	new_food(snake.body);

	window.start_text_element = document.getElementById("text-start");
	window.again_text_element = document.getElementById("text-again");
	window.start_text_element.style.display = "block";
}

function keyPressed() {
	if (key == "e") {
		snake.body.push(snake.body[snake.body.length - 1]);
	}
	if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
		if (!snake.alive) {
			snake = new Snake(floor(w / 2), floor(h / 2), boundaries);
			new_food(snake.body);
		}
		window.start_text_element.style.display = "none";
		if (!snake.moved) {
			window.again_text_element.style.display = "none";
		}
		if (!snake.moved) {
			start_tune.cloneNode(true).play();
		}
		snake.moved = true;
	}

	if (keyCode === UP_ARROW) {
		if (snake.body.length === 1) {
			snake.set_dir(0, -1);
		}
		// if snake is not going down
		else if (snake.body[0].y !== snake.body[1].y + snake.size) {
			snake.set_dir(0, -1);
		}
	}
	if (keyCode === DOWN_ARROW) {
		if (snake.body.length === 1) {
			snake.set_dir(0, 1);
		}
		// if snake is not going up
		else if (snake.body[0].y !== snake.body[1].y - snake.size) {
			snake.set_dir(0, 1);
		}
	}
	if (keyCode === LEFT_ARROW) {
		if (snake.body.length === 1) {
			snake.set_dir(-1, 0);
		}
		// if snake is not going right
		else if (snake.body[0].x !== snake.body[1].x + snake.size) {
			snake.set_dir(-1, 0);
		}
	}
	if (keyCode === RIGHT_ARROW) {
		if (snake.body.length === 1) {
			snake.set_dir(1, 0);
		}
		// if snake is not going left
		else if (snake.body[0].x !== snake.body[1].x - snake.size) {
			snake.set_dir(1, 0);
		}
	}
}

// draw() automatically loops until program stops
function draw() {
	noStroke();
	scale(pixel_size);
	background(0);

	if (snake.dir.x == 0 && snake.dir.y == 0 && snake.moved == true) {
		window.again_text_element.style.display = "block";
	}

	if (snake.did_eat(food)) {
		snake.body.push(snake.body[snake.body.length - 1]);
		new_food(snake.body);
		eat_tune.cloneNode(true).play();
	}

	snake.update();
	food.show();
	snake.show();
}
