function Particle(x, y, dx, dy, img) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.speed = 10;
    this.img = img;
    this.move = function() {
        this.x += this.speed * this.dx;
        this.y += this.speed * this.dy;
    }
}

function ParticleEffekt(level, centerX, centerY) {
    this.level = level;
    this.particles = new Array();
    this.centerX = centerX;
    this.centerY = centerY;
    this.amount = 62;
    this.age = 0;
    this.maxAge = 20;
    this.enable = true;
    this.createParticles = function() {
        for( var i = 0; i < this.amount; i++) {
            // calculate dx / dy along a circle
            dx = Math.sin(i / 10);
            dy = Math.cos(i / 10);
            rnd = Math.random();
            if (rnd < 0.5)
                image = this.level.ParticleGfx[0]; 
            else
                image = this.level.ParticleGfx[1]; 
            this.particles.push(new Particle(centerX, centerY, dx, dy, image));
        }
    }
    this.moveParticles = function() {
        if (this.enable == false) return;
        for( p = 0; p < this.amount; p++) {
            this.particles[p].move();
        }
        this.age += 1;
        if (this.age >= this.maxAge) this.enable = false;
    }
    this.drawParticles = function(context) {
        for( j = 0; j < this.amount; j++) {
            p = this.particles[j];
            context.drawImage(p.img, 0, 0, p.img.width, p.img.height, p.x, p.y-level.background_y, p.img.width, p.img.height);
        }
    }
    this.createParticles();
}