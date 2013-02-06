/*jshint expr:true */
/*
 * GLOBAL FUNCTIONS / ENTRY
 */
function start_game() {
    Game.init();
    for( var i = 0; i < Game.Level.length; i++) {
        Game.Level[i].init();
    }
    window.addEventListener('keydown', function( event ) {
        Game.keyDownEvent.call( Game, event );
    }, false);
    window.addEventListener('keyup', function( event ) {
        Game.keyUpEvent.call( Game, event );
    }, false);
        //Game.intro();
    Game.start();
}
( function( global ) {


  /*
   * GAME
   */
    global.Game = {
        fps : 1000 / 50,
        animationTimer : 100,
        scriptTimer : 1000,
        Level : [],
        currentLevel : 0,
        nextLevelTimer : 3000,
        fontStyle : "bold 20px sans-serif",
        fontColor : "white",
        activeShots: [],
        stateID: null,
        animateID: null,
        levelScriptID: null,
        playerShotID: null,
        player: Object.create( Player ).setOptions( {
            x: 400, y: 500,
            speedX: 10, speedY: 10,
            anim: "shooty",
            lives: 3,
            energy: 1000,
            maxEnergy: 2500,
            shooting: true,
            shotFrequency: 300
        }),
        init : function() {
            this.canvas = document.getElementById('gcanvas');
            this.context = this.canvas.getContext('2d');
            this.player.init();
        },
        start : function() {
            window.clearInterval(this.stateID);
            window.clearInterval(this.animateID);
            window.clearInterval(this.levelScriptID);
            window.clearInterval(this.playerShotID);
            this.stateID = utils.setInterval(this, this.runningMainLoop, this.fps);
            this.animateID = utils.setInterval(this, this.animate, this.animationTimer);
            this.levelScriptID = utils.setInterval(this, this.Level[this.currentLevel].script, this.scriptTimer);
            this.playerShotID = utils.setInterval(this, this.fireShot, this.player.shotFrequency);
            this.player.setLevel( this.Level[ this.currentLevel ] );
        },

        gameOver : function() {
            window.clearInterval(this.stateID);
            this.stateID = utils.setInterval(this, this.gameOverMainLoop, this.fps);
        },

        intro : function() {
            window.clearInterval(this.stateID);
            this.stateID = utils.setInterval(this, this.gameIntroMainLoop, this.fps);
            utils.setTimeout(this, this.start, 4000); // 10 for debug
        },

        loadNextLevel : function() {
            if(this.currentLevel < this.Level.length - 1) {
                this.currentLevel++;
                this.Level[this.currentLevel].init();
                //this.Level[this.currentLevel].Enemies = new Array();
                this.intro();
            } else {
                this.gameOver();
            }
            return;
        },

        collide : function(obj1, obj2) {
            // Bounding Box collision
            //if( isNaN( obj1.x ) || isNaN( obj1.y ) )
                //return false;
            //if( isNaN( obj2.x ) || isNaN( obj2.y ) )
                //return false;
            if(obj1.y + obj1.h < obj2.y)
                return false;
            if(obj1.y > obj2.y + obj2.h)
                return false;
            if(obj1.x + obj1.w < obj2.x)
                return false;
            if(obj1.x > obj2.x + obj2.w)
                return false;
            return true;
        },

        fireShot: function() {
            var shots = this.player.fireShot();
            if ( shots.shot1 ) this.activeShots.push( shots.shot1 );
            if ( shots.shot2 ) this.activeShots.push( shots.shot2 );
        },
        animate : function() {
            var l = this.Level[this.currentLevel];
            var anim = l.anims[this.player.anim];
            var e, i;
            var shot, shotID;

            this.player.animIndex = anim.next( this.player.animIndex );
            if ( this.player.state === "explode" && anim.lastFrame ) {
                ( this.player.lives === 0 ) ? this.gameOver() : this.player.setState( "invul" );
            }

            // animate shot
            this.activeShots.forEach( function( shot ) {
                var anim = l.anims[ shot.anim ];
                shot.animIndex = anim.next( shot.animIndex );
            });

            // animate enemys
            for( i = 0; i < l.Enemies.length; i++) {
                if ( !l.Enemies[i] )
                    continue;
                e = l.Enemies[i];
                anim = l.anims[ e.anim ];
                e.animIndex = anim.next( e.animIndex );
                if ( e.state === "explode" ) {
                    ( e.extra ) ? e.setState( "extra" ) : l.removeEnemy( i );
                }
            }
        },

        keyDownEvent : function(event) {
            switch (event.keyCode) {
                case 37:
                    // Left
                    this.player.dx = -this.player.speedX;
                break;

                case 38:
                    // Up
                    this.player.dy = -this.player.speedY;
                break;

                case 39:
                    // Right
                    this.player.dx = this.player.speedX;
                break;

                case 40:
                    // Down
                    this.player.dy = this.player.speedY;
                break;
            }
        },

        keyUpEvent : function(event) {
            switch (event.keyCode) {
                case 37:
                    // left & right
                    case 39:
                    this.player.dx = 0;
                break;

                case 38:
                    // Up and Down
                    case 40:
                    this.player.dy = 0;
                break;
            }
        },

        gameOverMainLoop : function() {
            this.context.drawImage(this.Level[this.currentLevel].gameOver, 0, 0, 800, 600, 0, 0, 800, 600);
            return;
        },

        gameIntroMainLoop : function() {
            var l = this.Level[this.currentLevel];
            // Draw background
            this.context.drawImage(l.bg, 0, l.background_y, 800, 600, 0, 0, 800, 600);

            this.context.fillStyle = this.fontColor;
            this.context.font = this.fontStyle;
            for( var i = 0; i < l.introText.length; i++) {
                this.context.fillText(l.introText[i], 100, 200 + (i * 29));
            }
            return;
        },

        runningMainLoop : function() {
            var l = this.Level[this.currentLevel];
            var e, i, j;
            var cords, _;
            var anim, frame, w, h, proz, amount, bar, t;
            var shotID, shot;

            this.Level[this.currentLevel].background_y--;

            if(l.done === true) {
                this.context.drawImage(l.levelComplete, 0, 0, 800, 600, 0, 0, 800, 600);
                window.clearInterval(this.stateID);
                this.stateID = utils.setInterval(this, this.loadNextLevel, this.nextLevelTimer);
                return;
            }

            // l.Enemies
            for( i = 0; i < l.Enemies.length; i++) {
                if( !l.Enemies[i] )
                    continue;
                if(l.Enemies[i].y > l.background_y + 600) {
                    l.removeEnemy(i);
                    continue;
                }
                if(l.Enemies[i].state != "explode") {
                    cords = l.Enemies[i].tick();
                    l.Enemies[i].x += cords[0];
                    l.Enemies[i].y += cords[1];
                }
                l.Enemies[i].w = l.anims[l.Enemies[i].anim][l.Enemies[i].animIndex].width;
                l.Enemies[i].h = l.anims[l.Enemies[i].anim][l.Enemies[i].animIndex].height;
            }

            if(this.player.state == "normal" || this.player.state == "invul") {
                // Update this.player position
                // add "standard thrust" - move with y plane
                this.player.y--;
                if(this.player.x < 0)
                    this.player.x = 0;
                if(this.player.x > 728)
                    this.player.x = 728;
                if(this.player.y < l.background_y)
                    this.player.y = l.background_y;
                if(this.player.y > l.background_y + 560)
                    this.player.y = l.background_y + 560;
                if(this.player.x + this.player.dx >= 0 &&
                   this.player.x + this.player.dx <= 728 &&
                       this.player.y + this.player.dy >= l.background_y &&
                           this.player.y + this.player.dy <= l.background_y + 560) {

                    this.player.x += this.player.dx;
                    this.player.y += this.player.dy;
                }
                this.player.anim = "shooty";
                if(this.player.dx < 0) {
                    this.player.anim = "shooty_left";
                } else if(this.player.dx > 0) {
                    this.player.anim = "shooty_right";
                }
            }

            this.player.w = l.anims[this.player.anim][this.player.animIndex].width;
            this.player.h = l.anims[this.player.anim][this.player.animIndex].height;

            // Update shots
            for( i = 0; i < l.Enemies.length; i++) {
                if ( !l.Enemies[i] )
                    continue;
                e = l.Enemies[i];
                e.shootingTimer++;
                if(e.shootingTimer >= e.shootingFrequency) {
                    l.Enemies[i].doShooting(l.Enemies[i]);
                    e.shootingTimer = 0;
                }
            }
            this.activeShots.forEach( function( shot ) {
                shot.y += shot.dy;
                if ( shot.y <= l.background_y ) { //TODO|| shot.y - l.background_y >= 400 ) {
                    shot.active = false;
                    return;
                }

                // this.player collides with shot
                if(this.player.state == "normal" && this.collide(this.player, shot) && shot.enemy_shot === true) {
                    shot.active = false;
                    this.player.energy -= shot.energy;
                    if(this.player.energy <= 0) {
                        this.player.setState("explode");
                        l.Effects.push(new ParticleEffekt(l, this.player.x + this.player.w / 2, this.player.y + this.player.h / 2));
                    }
                }

                for( j = 0; j < l.Enemies.length; j++) {
                    if( !l.Enemies[j] )
                        continue;
                    // Enemy collides with shot
                    e = l.Enemies[j];
                    if(e.state == "normal" && this.collide(shot, e) && shot.enemy_shot === false) {
                        shot.active = false;
                        this.player.points += e.points;
                        e.energy -= shot.energy;
                        if(e.energy <= 0) {
                            e.setState("explode");
                            l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
                            break;
                        } else {
                            continue;
                        }
                    }
                }
            }, this );

            // remove all inactive shots
            this.activeShots = this.activeShots.filter( function( shot ) {
                return shot.active;
            } );

            // Detect this.player - Enemy collisions
            if(this.player.state == "normal") {
                for( i = 0; i < l.Enemies.length; i++) {
                    if( !l.Enemies[i] )
                        continue;
                    e = l.Enemies[i];
                    if(!this.collide(this.player, e))
                        continue;
                    if(e.state == "normal") {
                        this.player.energy -= 500;
                        if(this.player.energy <= 0) {
                            this.player.setState("explode");
                            l.Effects.push(new ParticleEffekt(l, this.player.x + this.player.w / 2, this.player.y + this.player.h / 2));
                            this.player.points += e.points;
                        }
                        e.setState("explode");
                        l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
                    }
                    if(e.state == "extra") {
                        // apply extra to this.player
                        this.player.addExtra(e.extra.name);
                        l.removeEnemy(i);
                    }
                }
            }
            // Draw background
            this.context.drawImage(l.bg, 0, l.background_y, 800, 600, 0, 0, 800, 600);

            // draw Enemies
            for( i = 0; i < l.Enemies.length; i++) {
                if( !l.Enemies[i] )
                    continue;
                e = l.Enemies[i];
                anim = l.anims[e.anim];
                frame = anim[e.animIndex];
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, e.x, e.y - l.background_y, e.w, e.h);
            }
            // draw Shots
            for ( shotID in this.activeShots ) {
                shot = this.activeShots[ shotID ];
                frame = l.anims[shot.anim][shot.animIndex];
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, shot.x, shot.y - l.background_y , frame.width, frame.height);
            }

            // draw player
            if( ! this.player.blinkState ) {
                anim = l.anims[this.player.anim];
                frame = anim[this.player.animIndex];
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, this.player.x, this.player.y - l.background_y, this.player.w, this.player.h);
            }
            // draw Status + Lives
            w = l.statusBar.width;
            h = l.statusBar.height;
            this.context.drawImage(l.statusBar, 0, 0, w, h, 0, 0, w, h);
            frame = l.anims.shooty[0];
            for( i = 0; i < this.player.lives; i++) {
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, (i * 20) + 10, 0, 20, 20);
            }
            this.context.fillStyle = this.fontColor;
            this.context.font = this.fontStyle;
            this.context.fillText(this.player.points.toString(), 200, 17);

            // draw Energybar
            bar = l.energyBar;
            proz = (this.player.energy / this.player.maxEnergy) * 100;
            amount = (600 / 100) * proz;
            for( i = 600; i > 600 - amount; i--) {
                this.context.drawImage(bar, 0, 0, bar.width, bar.height, 0, i, bar.width, bar.height);
            }

            // draw Fireball bar
            if(this.player.shotFireball === true) {
                bar = l.fireballBar;
                t = (new Date().getTime() - this.player.shotFireballTime);
                proz = (t / this.player.shotFireballFrequency) * 100;
                amount = (600 / 100) * proz;
                for( i = 600; i > 600 - amount; i--) {
                    this.context.drawImage(bar, 0, 0, bar.width, bar.height, 800 - bar.width, i, bar.width, bar.height);
                }
            }

            // draw Particles
            for( i = 0; i < l.Effects.length; i++) {
                if(l.Effects[i].enable) {
                    l.Effects[i].moveParticles();
                    l.Effects[i].drawParticles(this.context);
                }
            }

            return;
        }
    };

}( this ) );
