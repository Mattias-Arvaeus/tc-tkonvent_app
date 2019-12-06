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
        let temp = this.body[this.body.length - 1].copy();

        // place copy of head at tail and move to direction
        temp.x = this.body[0].x + this.dir.x;
        temp.y = this.body[0].y + this.dir.y;

        // use temp to predict next snake pos
        // boundaries
        if (temp.x < this.boundaries['xmin'] || temp.x + this.size > this.boundaries['xmax']) {
            this.alive = false;
        }
        if (temp.y < this.boundaries['ymin'] || temp.y + this.size > this.boundaries['ymax']) {
            this.alive = false;
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
                this.alive = false;
            }
        }

        if (!this.alive) {
            this.c_head = this.c_body = color(155, 0, 0);
            this.set_dir(0, 0);
        }
    }

    show() {
        let edge_indent = 0;
        // index is always more than array length
        for (let [index, b] of this.body.entries()) {
            if (index >= this.rainbow.colors.length) {
                let r = new Rainbow(this.rainbow_len)
                this.rainbow.colors.push(...r.colors);
            }
            fill(this.rainbow.colors[index]);

            rect(b.x + edge_indent / 2, b.y + edge_indent / 2, this.size - edge_indent, this.size - edge_indent);
        }
    }
}
