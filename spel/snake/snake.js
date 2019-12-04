class Snake {
    constructor(x, y, boundaries) {
        this.body = [];
        this.body.push(createVector(x, y));

        this.size = 1;
        this.dir = createVector(0, 0);
        this.c = color(0, 175, 0);

        this.boundaries = boundaries;
        this.alive = true;
    }

    set_dir(x, y) {
        this.dir.x = x;
        this.dir.y = y;
    }

    did_eat(pos) {
        if (this.body[0].x == pos.x && this.body[0].y == pos.y) {
            return true;
        }
        return false;
    }

    die() {
        this.c = color(175, 0, 0);
        this.set_dir(0, 0);
        this.alive = false;
        console.log('score: ' + this.body.length - 1)
    }

    update() {
        // make copy of tail
        let temp = this.body[this.body.length - 1].copy();

        // place copy of head at tail
        temp.x = this.body[0].x + this.dir.x;
        temp.y = this.body[0].y + this.dir.y;

        // boundaries
        if (temp.x < boundaries['xmin'] || temp.x + this.size > boundaries['xmax']) {
            this.die();
        }
        if (temp.y < boundaries['ymin'] || temp.y + this.size > boundaries['ymax']) {
            this.die();
        }

        if (this.alive) {
            // add tail copy to front of array
            this.body.unshift(temp);

            // remove real tail
            this.body.pop();
        }

        // self hit
        for (let b = 1; b < this.body.length; b++) {
            if (this.body[0].x == this.body[b].x && this.body[0].y == this.body[b].y) {
                this.die();
            }
        }
    }

    show() {
        fill(this.c);
        for (let b of this.body) {
            rect(b.x, b.y, this.size - 0.1, this.size - 0.1);
        }
    }

}
