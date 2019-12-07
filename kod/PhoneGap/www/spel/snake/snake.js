class Snake {
    constructor(x, y, boundaries) {
        this.body = [];
        this.body.push(createVector(x, y));

        this.size = 1;
        this.dir = createVector(0, 0);
        this.c_head = color(0, 225, 0);
        this.c_body = color(0, 155, 0);
        this.boundaries = boundaries;
        this.alive = true;

        this.rainbow_len = 25;
        this.rainbow = new Rainbow(this.rainbow_len);
        for (var i = 0; i < (w * h) / this.rainbow_len; i++) {
            var r = new Rainbow(this.rainbow_len);
            this.rainbow.colors.push(...r.colors);
        }
        this.die_tune = new Audio('resources/audio/end-tune.mp3');
        this.die_sequence = true; //perform certain actions when this snake dies
        this.moved = false;
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

    update() {
        // make copy of tail
        var temp = this.body[this.body.length - 1].copy();

        // place copy of head at tail and move to direction
        temp.x = this.body[0].x + this.dir.x;
        temp.y = this.body[0].y + this.dir.y;

        // use temp to predict next snake pos
        // boundaries
        if (temp.x < this.boundaries.xmin || temp.x + this.size > this.boundaries.xmax) {
            this.alive = false;
        }
        if (temp.y < this.boundaries.ymin || temp.y + this.size > this.boundaries.ymax) {
            this.alive = false;
        }

        if (this.alive) {
            // add tail copy to front of array
            this.body.unshift(temp);

            // remove real tail
            this.body.pop();
        }

        // self hit
        for (var b = 1; b < this.body.length; b++) {
            if (this.body[0].x == this.body[b].x && this.body[0].y == this.body[b].y) {
                this.alive = false;
            }
        }

        if (!this.alive) {
            this.c_head = this.c_body = color(155, 0, 0);
            this.set_dir(0, 0);
            if (this.die_sequence) {
                this.die_tune.play();
                console.log('score: ' + (this.body.length - 1));

                this.die_sequence = false;
            }
        }
    }

    show() {
        var edge_indent = -0.01; //pieces overlap = no ugly borders inside snake
        // index is always more than array length
        for (var [index, b] of this.body.entries()) {
            fill(this.rainbow.colors[index]);

            rect(b.x + edge_indent / 2, b.y + edge_indent / 2, this.size - edge_indent, this.size - edge_indent);

        }
    }
}
