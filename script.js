let fireworks = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);
}

function draw() {
  background(0, 25); // Create a fading effect
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();
    if (fireworks[i].done()) {
      fireworks.splice(i, 1);
    }
  }
}

function mousePressed() {
  let firework = new Firework(mouseX, mouseY);
  fireworks.push(firework);
}

class Firework {
  constructor(x, y) {
    this.firework = new Particle(x, y, true);
    this.exploded = false;
    this.particles = [];
    this.baseColor = this.getRandomBaseColor(); // Random base color for each firework
    this.pattern = int(random(3)); // Randomly select a pattern
  }

getRandomBaseColor() {
    const colors = [10,20,30,40,60,150,200,300,310]; // HSB values for blue 200, red 0, purple 300, white, yellow 60, orange 20, green 100
    return random(colors);
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(createVector(0, 0.3));
      this.firework.update();
      if (this.firework.vel.y >= 0) {
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(createVector(0, 0.3));
      this.particles[i].update();
      if (this.particles[i].done()) {
        this.particles.splice(i, 1);
      }
    }
  }

  explode() {
    if (this.pattern === 0) {
      this.circlePattern();
    } else if (this.pattern === 1) {
      this.starPattern();
    } else if (this.pattern === 2) {
      this.spiralPattern();
    }
  }
    circlePattern() {
    let angle = TWO_PI /200;
    for (let i = 0; i < 200; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false, angle * i, this.baseColor);
      this.particles.push(p);
    }
  }

  starPattern() {
    let angle = TWO_PI / 200;
    for (let i = 0; i < 200; i++) {
      let p = new Particle(this.firework.pos.x, this.firework.pos.y, false, angle * i, this.baseColor);
      this.particles.push(p);
    }
  }

  spiralPattern() {
    for (let i = 0; i < 200; i++) {
      let angle = i * 0.1;
      let radius = i * 0.5;
      let x = this.firework.pos.x + cos(angle) * radius;
      let y = this.firework.pos.y + sin(angle) * radius;
      let p = new Particle(x, y, false, angle, this.baseColor);
      this.particles.push(p);
    }
  }

  done() {
    return this.exploded && this.particles.length === 0;
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (let p of this.particles) {
      p.show();
    }
  }
}


class Particle {
  constructor(x, y, firework, angle = 0, baseColor = 0) {
    this.pos = createVector(x, y);
    this.firework = firework;
    this.lifespan = 255;
    this.baseColor = baseColor;
    this.color = this.baseColor + random(-20, 20); // Slightly vary the color
    if (this.firework) {
      this.vel = createVector(0, random(-12, -8));
    } else {
      this.vel = p5.Vector.fromAngle(angle);
      this.vel.mult(random(1, 15));
    }
    this.acc = createVector(0, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.firework) {
      this.vel.mult(0.9);
      this.lifespan -= 4;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  done() {
    return this.lifespan < 0;
  }

  show() {
    colorMode(HSB);
    if (!this.firework) {
      strokeWeight(3);
      stroke(this.color, 255, 255, this.lifespan);
    } else {
      strokeWeight(6);
      stroke(this.baseColor, 255, 255);
    }
    point(this.pos.x, this.pos.y);
  }
}