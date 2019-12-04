let snake;
let rez = 30;
let food;
let w, h;

function new_food(body) {
    let placing_food = true;
    let food_on_body = false;
    while (placing_food) {
        food = new Food(w, h);

        for (b of body) {
            if (food.x === b.x && food.y === b.y) {
                food_on_body = true;
                break;
            }
            else {
                food_on_body = false;
            }
        }
        if (!food_on_body) {
            placing_food = false;
        }

    }
}

function setup() {
    w = 15;
    h = 15;
    createCanvas(w * rez, h * rez);
    frameRate(8);

    boundaries = { xmin: 0, xmax: w, ymin: 0, ymax: h }
    snake = new Snake(floor(w / 2), floor(h / 2), boundaries);
    new_food(snake.body);
}

function keyPressed() {
    if (key == 'e') {
        snake.body.push(snake.body[snake.body.length - 1]);
    }
    if (!snake.alive) {
        if (keyCode === UP_ARROW || keyCode === DOWN_ARROW || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
            snake = new Snake(floor(w / 2), floor(h / 2), boundaries);
            new_food(snake.body);
        }
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
    scale(rez);
    background(0);

    snake.update();

    if (snake.did_eat(food)) {
        snake.body.push(snake.body[snake.body.length - 1]);
        new_food(snake.body);
    }

    food.show();
    snake.show();
}
