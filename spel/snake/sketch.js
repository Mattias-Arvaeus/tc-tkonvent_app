let snake;
let rez = 20;
let food;
let w, h;

function new_food(body) {
    placing_food = true;
    food_placed_on_body = false;
    while (placing_food) {
        for (b in body) {
            food = new Food(w, h);
            if (food.x == b.x && food.y == b.y) {
                print('food on body')
                food_placed_on_body = true;
            }
            else {
                food_placed_on_body = false;
                continue;
            }
            break;
        }
        if (!food_placed_on_body) {
            break;
        }
    }
}

function setup() {
    w = h = 15;
    createCanvas(w * rez, h * rez);
    frameRate(8);

    boundaries = { xmin: 0, xmax: w, ymin: 0, ymax: h }
    snake = new Snake(7, 7, boundaries);
    new_food(snake.body);
}

function keyPressed() {
    if (keyCode === UP_ARROW) {
        snake.set_dir(0, -1)
    }
    if (keyCode === DOWN_ARROW) {
        snake.set_dir(0, 1)
    }
    if (keyCode === RIGHT_ARROW) {
        snake.set_dir(1, 0)
    }
    if (keyCode === LEFT_ARROW) {
        snake.set_dir(-1, 0)
    }
}

// draw gets iterated until program stops
function draw() {
    noStroke();
    scale(rez);
    background(0);

    snake.update();

    if (snake.did_eat(food)) {
        new_food(snake.body);
        snake.body.push(snake.body[snake.body.length - 1]);
    }

    food.show();
    snake.show();
}
