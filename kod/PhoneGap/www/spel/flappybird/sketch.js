//set screen dimensions to easy-to-reach variables.
const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

//easy to reach, important variables.
var bird;
var pipes = [];
var gameOver = false;
var gameStarted = false;
var score = 0;

var start_sound = new Audio("sound/start1.wav");
var cleared_sound = new Audio("sound/cleared2.wav")
var die_sound = new Audio("sound/die.wav");

function calculateAspectRadioFit(vw, vh, maxWidth = 1920, maxHeight = 1080) {
    var ratio = Math.min(maxWidth / vw, maxHeight / vh);
    console.log((vw * ratio)/(vh * ratio));
    return vw * ratio;
}

//sprites
var img;
var spr_bird;
var bgx1 = 0;
var bgx2 = calculateAspectRadioFit();
var scrollSpeed = 1;

function preload() {
    /*img = loadImage("img/flappyb.png");*/
    bgimg = loadImage("img/backg.png");
    bg2img = loadImage("img/backg2.png");
}

function setup() {
    //init game.
    var canvas = createCanvas(vw, (vh * 0.8));
    canvas.parent("canvas-container");

    //getting html elements.
    var canvasElement = document.getElementById("canvas-container");
    var startText = document.getElementById("startText");
    var endText = document.getElementById("endText");
    var scoreText = document.getElementById("scoreText");

    //init hammer touch.
    var hammertime = new Hammer(canvasElement);
    hammertime.on('tap', function() {
        pressed();
    });
    
    //hide unrelevant text.
    endText.hidden = true;
    scoreText.hidden = true;

    //give birth to a new bird.
    bird = new Bird();
    /*
    spr_bird = createSprite(bird.x, bird.y, bird.d, bird.d);
    spr_bird.addImage(img);
    */

    pipes.push(new Pipe());

    //play the start jingle


    //don't start the game until screen tapped.
    noLoop();
}

function draw() {
    noStroke(); //no black borders on graphics.
    background(100, 100, 255); //blue sky background.

    //drawing background image with scroll
    image(bgimg, bgx1, 0, calculateAspectRadioFit(), vh);
    image(bg2img, bgx2, 0, calculateAspectRadioFit(), vh);
  
    bgx1 -= scrollSpeed;
    bgx2 -= scrollSpeed;
  
    if (bgx1 < -calculateAspectRadioFit()){
        bgx1 = calculateAspectRadioFit();
    }
    if (bgx2 < -calculateAspectRadioFit()){
        bgx2 = calculateAspectRadioFit();
    }
  
    bird.update(); //each frame, update the bird's velocity.

    //spawn new pipe every 80th frame.
    if (frameCount % 80 == 0 && !gameOver) {
        pipes.push(new Pipe());
    }

    //update pipes.
    for (var [index, pipe] of pipes.entries()) {
        //draw and update pipe location.
        pipe.show();
        pipe.update();
        
        //if bird cleares pipe, add a score.
        for (x of pipes) {
            if ((x.x + (x.w / 2)) <= bird.x && x.cleared == false) {
                score++;
                cleared_sound.cloneNode(true).play();
                document.getElementById("scoreText").innerHTML = score;
                x.cleared = true;
                console.log(score);
            }
        }

        //check if bird hits pipe.
        if (pipe.hits(bird)) {
            if (!gameOver){
                die_sound.play();
            }
            gameOver = true;
            endText.hidden = false;
            for (p of pipes) {
                p.speed = 0;
            }
        }

        //when pipe is offscreen, remove it.
        if (pipe.offscreen()) {
            pipes.splice(index, 1);
        }
    }

    //if bird crashes into ground, end the game.
    if (bird.y >= (vh * 0.8)){
        gameOver = true
        for (pipe of pipes) {
            pipe.speed = 0;
            scrollSpeed = 0;
        }
        endText.hidden = false;
    }

    //finally, draw the bird.
    bird.show(); 

}

//for easy play on pc, REMOVE BEFORE RELEASE.
function keyPressed() {
    if (key == ' ' && !gameOver) {
        pressed();
    }
}

function pressed() {
    if (!gameStarted){
        start_sound.play();
    }
    gameStarted = true;
    bird.up();
    startText.hidden = true;
    scoreText.hidden = false;
    loop();
    if (gameOver) {
        //reload page.
        location.reload();
    }
}