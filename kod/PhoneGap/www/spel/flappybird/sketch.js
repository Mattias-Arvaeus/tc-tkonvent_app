var bird;
var pipes = [];

function setup() {
    createCanvas(400, 600);
    bird = new Bird();
    pipes.push(new Pipe());
}

function draw() {
    background(0);
    bird.update();
    bird.show();

    if (frameCount % 80 == 0) {
        pipes.push(new Pipe());
    }

    for (var i = pipes.length-1; i >= 0; i-- ) {
        pipes[i].show();
        pipes[i].update();

        if (pipes[i].hits(bird)) {
            console.log("HIT");
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
        }
    }
}

function keyPressed() {
    if (key == ' ') {
        bird.up();
    }
}