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

var btn, easybtn, normalbtn, hardbtn, insanebtn, againbtn, backbtn, savedStroke, scorebtn;

const game = {
	started: false,
	ended: false
};

var globalsnakedead = false;

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

	var savedDifficulty;
	// button template
	btn = new Clickable();
	btn.resize(vw * 0.55, vw * 0.18);
	btn.x = vw * 0.5 - btn.width * 0.5;
	btn.strokeWeight = vw * 0.015;
	btn.cornerRadius = 0;
	btn.textFont = "silkscreen";
	btn.textSize = vw * 0.07;
	var btnspacing = vh * 0.03;
	btn.onPress = function() {
		this.color = this.stroke;
		this.textColor = "#ffffff";
	};
	btn.onRelease = function() {
		if (!game.started) {
			savedDifficulty = this["difficulty"];
			savedStroke = this.stroke;
			new_game(savedDifficulty);
		}
		this.color = "#ffffff";
		this.textColor = "#000000";
	};

	centerbtns = function(btns) {
		var top = (vh - (btn.height * btns + btnspacing * (btns - 1))) / 2;
		top = top + vh - h * pixel_size;
		return top;
	};

	// easy button
	easybtn = { ...btn };
	easybtn.y = centerbtns(4);
	easybtn.text = "easy";
	easybtn.stroke = "#00ff00";
	easybtn["difficulty"] = 4;

	// normal button
	normalbtn = { ...btn };
	normalbtn.y = easybtn.y + btn.height + btnspacing;
	normalbtn.text = "normal";
	normalbtn.stroke = "#ffff00";
	normalbtn["difficulty"] = 8;

	// hard button
	hardbtn = { ...btn };
	hardbtn.y = normalbtn.y + btn.height + btnspacing;
	hardbtn.text = "hard";
	hardbtn.stroke = "#ff0000";
	hardbtn["difficulty"] = 12;

	// insane button
	insanebtn = { ...btn };
	insanebtn.y = hardbtn.y + btn.height + btnspacing;
	insanebtn.text = "insane!!!";
	insanebtn.stroke = "#000000";
	insanebtn["difficulty"] = 16;

	// again button
	againbtn = { ...btn };
	againbtn.y = centerbtns(2);
	againbtn.text = "again";
	againbtn.onRelease = function() {
		game.ended = false;
		game.started = true;
		new_game(savedDifficulty);
		globalsnakedead = false;
		this.color = "#ffffff";
		this.textColor = "#000000";
	};

	// back button
	backbtn = { ...btn };
	backbtn.y = againbtn.y + btn.height + btnspacing;
	backbtn.text = "back";
	backbtn.stroke = "#ff66ff";
	backbtn.onRelease = function() {
		game.started = game.ended = globalsnakedead = false;
		this.color = "#ffffff";
		this.textColor = "#000000";
	};

	// score button (not interactive)
	scorebtn = { ...btn };
	scorebtn.resize(btn.width * 1.3, btn.height * 0.7);
	scorebtn.y = againbtn.y - scorebtn.height - btnspacing;
	scorebtn.x = vw * 0.5 - scorebtn.width * 0.5;
	scorebtn.stroke = "#0000ff";
	scorebtn.onPress = function() {};
	scorebtn.onRelease = function() {};
}

// game loop
function draw() {
	noStroke();

	if (!game.started) {
		background(color(0, 0, 92));
		easybtn.draw();
		normalbtn.draw();
		hardbtn.draw();
		insanebtn.draw();
	}

	if (globalsnakedead) {
		score_final = snake.body.length - 1;
		scorebtn.text = "score: " + score_final;
		againbtn.stroke = savedStroke;
		game.ended = true;
		scorebtn.draw();
		againbtn.draw();
		backbtn.draw();
	}

	scale(pixel_size); // resets after draw loop begins again

	if (game.started && !game.ended) {
		// draw over menu buttons
		background(color(0, 0, 92));
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
	// border
	//rectangle();
}

function rectangle() {
	stroke(255);
	fill(255, 255, 255, 100);
	rect(70, 70, 60, 60, 10);
}
