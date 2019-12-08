// global vars
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const w = 17; // snake pixel size
var h = w * 4;
const fps = 8;
const pixel_size = vw / w;
console.log("setting pixel size to " + pixel_size);
var setting_height = true;
while (setting_height) {
	if (h * pixel_size > vh) {
		h--;
	} else {
		setting_height = false;
	}
}
console.log("setting canvas height (in pixels) to " + h);

var snake;
var food;
var boundaries = { xmin: 0, xmax: w, ymin: 0, ymax: h };

var eat_tune = new Audio("resources/audio/eat-tune.mp3");

function new_food(body) {
	var placing_food = true;
	var food_on_body = false;
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
	var canvas = createCanvas(w * pixel_size, h * pixel_size);
	canvas.parent("canvas-container");
	screen.orientation.lock("portrait");
	frameRate(fps);

	snake = new Snake(floor(w / 2), floor(h / 2), boundaries);
	new_food(snake.body);

	window.start_text_element = document.getElementById("text-start");
	window.again_text_element = document.getElementById("text-again");
}

function draw() {
	// game loop
	noStroke();
	scale(pixel_size);
	background(color(0, 0, 85));

	if (snake.did_eat(food)) {
		snake.body.push(snake.body[snake.body.length - 1]);
		new_food(snake.body);
		eat_tune.cloneNode(true).play();
	}

	snake.input();
	snake.update();
	food.show();
	snake.show();
}
