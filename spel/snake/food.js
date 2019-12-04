class Food {
    constructor(rangex, rangey) {
        this.x = floor(random(rangex));
        this.y = floor(random(rangey));
        this.size = 1;
        this.c = color(0, 0, 175);
    }

    show() {
        fill(this.c);
        rect(this.x, this.y, this.size, this.size);
    }
}
