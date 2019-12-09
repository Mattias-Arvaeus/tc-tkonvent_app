const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var bird;
var pipes = [];
var gameOver = false;

function setup() {
    var canvas = createCanvas(400, 600);
    canvas.parent("canvas-container");
    bird = new Bird();
    pipes.push(new Pipe());
    noLoop();
}

function draw() {
    background(0);
    bird.update();
    //bird.show();

    if (frameCount % 80 == 0 && !gameOver) {
        pipes.push(new Pipe());
    }

    for (var [index, pipe] of pipes.entries()) {
        pipe.show();
        pipe.update();

        if (pipe.hits(bird)) {
            for (p of pipes) {
                gameOver = true;
                p.speed = 0;
            }
        }

        if (pipe.offscreen()) {
            pipes.splice(index, 1);
        }
    }

    bird.show();
}

// function keyPressed() {
//     if (key == ' ' && !gameOver) {
//         bird.up();
//         loop();
//     }
// }

function touchStarted() {
    if (!gameover) {
        bird.up();
    }
}