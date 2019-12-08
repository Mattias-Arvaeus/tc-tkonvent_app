function by_hue(a, b) {
	if (hue(a) > hue(b)) {
		return 1;
	}
	if (hue(a) < hue(b)) {
		return -1;
	}
	return 0;
}

class Rainbow {
	constructor(len = 0) {
		colorMode(HSB);
		this.colors = [];
		while (this.colors.length < len) {
			// random hue, 100 saturation, 100 brightness
			var c = color(random(360), 100, 100);

			this.colors.push(c);
		}
		this.colors.sort(by_hue);
	}
}
