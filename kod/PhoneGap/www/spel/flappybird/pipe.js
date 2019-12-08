function Pipe() {
    this.top = random(height/2);
    this.bottom = random(height/2);
    this.gap = 150;
    this.x = width;
    this.w = 60;
    this.speed = 5;

    this.hits = function(bird) {
        if (bird.y < this.top || bird.y > height - (this.top + this.gap)) {
            if (bird.x > this.x || bird.x < this.x + this.w) {
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
        if (this.x < -this.w) {
            return true;
        } else {
            return false;
        }
    }
}