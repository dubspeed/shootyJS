
function ParticleEffekt(level, centerX, centerY) {
    var dx, dy, rnd, image;
    var i, p;

    this.level = level;
    this.particles = [];
    this.centerX = centerX;
    this.centerY = centerY;
    this.amount = 62;
    this.age = 0;
    this.maxAge = 20;
    this.enable = true;
    this.createParticles = function() {
        for( i = 0; i < this.amount; i++) {
            // calculate dx / dy along a circle
            dx = Math.sin(i / 10);
            dy = Math.cos(i / 10);
            //rnd = Math.random();
            //if (rnd < 0.5)
                //image = this.level.ParticleGfx[0];
            //else
                //image = this.level.ParticleGfx[1];
            p = Object.create( Particle ).setOptions( {
                x: centerX,
                y: centerY,
                dx: dx,
                dy: dy,
                speedX: 10,
                speedY: 10,
                anim: "particles"
            });
            this.particles.push( p );
        }
    };
    this.moveParticles = function() {
        if (this.enable === false) return;
        for( var p = 0; p < this.amount; p++) {
            this.particles[p].move();
        }
        this.age += 1;
        if (this.age >= this.maxAge) this.enable = false;
    };
    this.drawParticles = function(context) {
        for( var j = 0; j < this.amount; j++) {
            var p = this.particles[j];
            var anim = this.level.anims[p.anim];
            var frame = anim[p.animIndex];
            context.drawImage(frame, 0, 0, frame.width, frame.height, p.x, p.y - this.level.background_y, frame.width, frame.height);
        }
    };
    this.createParticles();
}
