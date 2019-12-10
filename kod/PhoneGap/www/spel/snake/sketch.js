// global vars (sorry, very messy)
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
const w = 15; // snake pixel size
var h = w * 4;
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

var snake, food;
var boundaries = { xmin: 0, xmax: w, ymin: 0, ymax: h };
var eat_tune = new Audio("resources/audio/eat-tune.mp3");

var button = {
	template: new Clickable(),
	easy: undefined,
	normal: undefined,
	hard: undefined,
	insane: undefined,
	again: undefined,
	back: undefined,
	score: undefined
};

var saved = {
	stroke: undefined,
	difficulty: undefined
};

var game = {
	started: false,
	ended: false
};

const difficulties = {
	easy: 5,
	normal: 9,
	hard: 13,
	insane: 17
}

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

function new_game(fps) {
	game.started = true;
	frameRate(fps);
	snake = new Snake(floor(w / 2), floor(h / 2), boundaries);
	new_food(snake.body);
}

function setup() {
	var canvas = createCanvas(w * pixel_size, h * pixel_size);
	canvas.parent("canvas-container");
	screen.orientation.lock("portrait");
	colorMode(HSB);

	// button template
	button.template.resize(vw * 0.55, vw * 0.18);
	button.template.x = vw * 0.5 - button.template.width * 0.5;
	button.template.strokeWeight = vw * 0.015;
	button.template.cornerRadius = 0;
	button.template.textFont = "silkscreen";
	button.template.textSize = vw * 0.07;
	var btnspacing = vh * 0.03;
	button.template.onPress = function () {
		this.color = this.stroke;
		this.textColor = "#ffffff";
	};
	button.template.onRelease = function () {
		if (!game.started) {
			saved.difficulty = this["difficulty"];
			saved.stroke = this.stroke;
			new_game(saved.difficulty);
		}
	};

	centerbtns = function (nbtns) {
		var top = (vh - (button.template.height * nbtns + btnspacing * (nbtns - 1))) / 2;
		top = top + vh - h * pixel_size;
		return top;
	};

	// easy button
	button.easy = { ...button.template };
	button.easy.y = centerbtns(4);
	button.easy.text = "easy";
	button.easy.stroke = "#00ff00";
	button.easy["difficulty"] = difficulties.easy;

	// normal button
	button.normal = { ...button.template };
	button.normal.y = button.easy.y + button.template.height + btnspacing;
	button.normal.text = "normal";
	button.normal.stroke = "#ffff00";
	button.normal["difficulty"] = difficulties.normal;

	// hard button
	button.hard = { ...button.template };
	button.hard.y = button.normal.y + button.template.height + btnspacing;
	button.hard.text = "hard";
	button.hard.stroke = "#ff0000";
	button.hard["difficulty"] = difficulties.hard;

	// insane button
	button.insane = { ...button.template };
	button.insane.y = button.hard.y + button.template.height + btnspacing;
	button.insane.text = "insane!!!";
	button.insane.stroke = "#000000";
	button.insane["difficulty"] = difficulties.insane;

	// again button
	button.again = { ...button.template };
	button.again.y = centerbtns(2);
	button.again.text = "again";
	button.again.onRelease = function () {
		game.ended = false;
		game.started = true;
		new_game(savedDifficulty);
	};

	// back button
	button.back = { ...button.template };
	button.back.y = button.again.y + button.template.height + btnspacing;
	button.back.text = "back";
	button.back.stroke = "#ff66ff";
	button.back.onRelease = function () {
		if (game.ended) {
			game.started = game.ended = false;
		}
	};

	// score button (not interactive)
	button.score = { ...button.template };
	button.score.resize(button.template.width * 1.3, button.template.height * 0.7);
	button.score.y = button.again.y - button.score.height - btnspacing;
	button.score.x = vw * 0.5 - button.score.width * 0.5;
	button.score.stroke = "#0000ff";
	button.score.onPress = function () { };
	button.score.onRelease = function () { };
}

// game loop
function draw() {
	noStroke();
	drawbg = function () {
		background(color(0, 0, 92));
	}

	// menu
	if (!game.started) {
		drawbg();
		button.easy.draw();
		button.normal.draw();
		button.hard.draw();
		button.insane.draw();
	}
	// reset buttons manually since btn.onOutside does not work on mobile
	else {
		button.easy.color = "#ffffff";
		button.easy.textColor = "#000000";
		button.normal.color = "#ffffff";
		button.normal.textColor = "#000000";
		button.hard.color = "#ffffff";
		button.hard.textColor = "#000000";
		button.insane.color = "#ffffff";
		button.insane.textColor = "#000000";
	}

	// die screen
	if (game.ended) {
		button.score.text = "score: " + snake.score_final;
		button.again.stroke = saved.stroke;

		button.score.draw();
		button.again.draw();
		button.back.draw();
	}

	// see line 165
	else {
		button.again.color = "#ffffff";
		button.again.textColor = "#000000";
		button.back.color = "#ffffff";
		button.back.textColor = "#000000";
	}
	scale(pixel_size); // resets after draw loop begins again

	// gameplay
	if (game.started && !game.ended) {
		// draw over menu buttons
		drawbg();
		snake.input();
		snake.update();

		if (snake.did_eat(food)) {
			snake.body.push(snake.body[snake.body.length - 1]);
			new_food(snake.body);
			eat_tune.cloneNode(true).play();
		}

		food.show();
		snake.show();
	}
}
