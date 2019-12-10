function Pipe() {
    this.top = random(height/2);
    this.bottom = random(height/2);
    this.gap = 150;
    this.x = width;
    this.w = 60;
    this.speed = 4;

    this.hits = function(bird) {
        for (pipe of pipes) {
            //pipe is a local variable.
            hit = collideRectCircle(this.x, 0, this.w, this.top, bird.x, bird.y, (bird.r + 5));
            hitBottom = collideRectCircle(this.x, this.top + this.gap, this.w, height - (this.top + this.gap), bird.x, bird.y, (bird.r + 5));
            if (hit || hitBottom) {
                return true;
            }     
        }

    }

    this.show = function() {
        fill(color(0, 255, 0));
        rect(this.x, 0, this.w, this.top);
        rect(this.x, this.top + this.gap, this.w, height - (this.top + this.gap));
                    //height-this.bottom
    }

    this.update = function() {
        this.x -= this.speed;
    }

    this.offscreen = function() {
<<<<<<< HEAD
        if (this.x < (-this.w * 10)) {
=======
        if (this.x < -100) {
>>>>>>> 5ea28f51100d192d93d6276ac2ad2953993130c0
            return true;
        } else {
            return false;
        }
    }
}