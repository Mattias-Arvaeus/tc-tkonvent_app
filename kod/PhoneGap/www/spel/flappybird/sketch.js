const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var bird;
var pipes = [];
var gameOver = false;
var score = 0;

function clicked() {
    bird.up();
    loop();
    startText.hidden = true;
    scoreText.hidden = false;
    if (gameOver) {
        location.reload();
    }
}

function setup() {
    //init game
    var canvas = createCanvas(vw, (vh * 0.8));
    canvas.parent("canvas-container");

    //getting html elements
    var canvasElement = document.getElementById("canvas-container");
    var startText = document.getElementById("startText");
    var endText = document.getElementById("endText");
    var scoreText = document.getElementById("scoreText");
    
    endText.hidden = true;
    scoreText.hidden = true;

    //give birth to our bird
    bird = new Bird();
    pipes.push(new Pipe());

    noLoop();
    canvasElement.addEventListener('click', clicked);
}

function draw() {
    noStroke();
    background(100, 100, 255);
    bird.update();

    if (frameCount % 80 == 0 && !gameOver) {
        pipes.push(new Pipe());
    }

    for (var [index, pipe] of pipes.entries()) {
        pipe.show();
        pipe.update();
        
        for (x of pipes) {
            if ((x.x + (x.w / 2)) <= bird.x && x.cleared == false) {
                score++;
                document.getElementById("scoreText").innerHTML = score;
                x.cleared = true;
                console.log(score);
            }
        }

        if (pipe.hits(bird)) {
            for (p of pipes) {
                gameOver = true
                p.speed = 0;
                endText.hidden = false;
            }
        }

        if (pipe.offscreen()) {
            pipes.splice(index, 1);
        }
    }

    if (bird.y >= (vh * 0.8)){
        gameOver = true
        for (pipe of pipes) {
            pipe.speed = 0;
        }
        endText.hidden = false;
    }

    bird.show(); 

}

//for easy play on pc, REMOVE BEFORE RELEASE
function keyPressed() {
    if (key == ' ' && !gameOver) {
        bird.up();
        startText.hidden = true;
        scoreText.hidden = false;
        loop();
        if (gameOver) {
            location.reload();
        }
    }
}