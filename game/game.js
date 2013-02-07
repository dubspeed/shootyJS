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
            shotFrequency: 300,
            blinkFrequency: 100,
            blinkTimeOut: 1500
        }),
        init : function() {
            this.canvas = document.getElementById('gcanvas');
            this.context = this.canvas.getContext('2d');
            this.player.init();
        },
        start : function() {
            this.stop();
            this.stateID = utils.setInterval(this, this.runningMainLoop, this.fps);
            this.animateID = utils.setInterval(this, this.animate, this.animationTimer);
            this.levelScriptID = utils.setInterval(this, this.Level[this.currentLevel].script, this.scriptTimer);
            this.playerShotID = utils.setInterval(this, this.fireShot, this.player.shotFrequency);
            this.player.setLevel( this.Level[ this.currentLevel ] );
        },
        stop: function() {
            window.clearInterval(this.stateID);
            window.clearInterval(this.animateID);
            window.clearInterval(this.levelScriptID);
            window.clearInterval(this.playerShotID);
        },

        gameOver : function() {
            this.stop();
            this.stateID = utils.setInterval(this, this.gameOverMainLoop, this.fps);
        },

        intro : function() {
            this.stop();
            this.stateID = utils.setInterval(this, this.gameIntroMainLoop, this.fps);
            utils.setTimeout(this, this.start, 4000); // 10 for debug
        },

        loadNextLevel : function() {
            if(this.currentLevel < this.Level.length - 1) {
                this.currentLevel++;
                this.Level[this.currentLevel].init();
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

            var a = l.anims[this.player.anim];
            this.player.animIndex = a.next( this.player.animIndex );
            if ( this.player.state === "explode" )
                if ( a.lastFrame )
                    ( this.player.lives === 0 ) ? this.gameOver() : this.player.setState( "invul" );

            // animate shot
            this.activeShots.forEach( function( shot ) {
                shot.animIndex = l.anims[ shot.anim ].next( shot.animIndex );
            });

            // animate enemys
            l.enemies.forEach( function ( e, i ) {
                if ( !e ) return;
                e.animIndex = l.anims[ e.anim ].next( e.animIndex );
                if ( e.state === "explode" )
                    ( e.extra ) ? e.setState( "extra" ) : l.removeEnemy( i );
            });
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
        updateShooting: function() {
            var l = this.Level[this.currentLevel];
            var that = this;

            l.enemies.forEach( function( e ) {
                if ( !e ) return;
                e.shootingTimer++;
                if(e.shootingTimer >= e.shootingFrequency) {
                    e.doShooting( e );
                    e.shootingTimer = 0;
                }
            });

            this.activeShots.forEach( function( shot ) {
                shot.y += shot.dy;
                if ( shot.y <= l.background_y ) { //TODO enemy shot || shot.y - l.background_y >= 400 ) {
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

                l.enemies.forEach( function( e, j ) {
                    if ( !e ) return;
                    // Enemy collides with shot
                    if(e.state == "normal" && that.collide(shot, e) && shot.enemy_shot === false) {
                        shot.active = false;
                        that.player.points += e.points;
                        e.energy -= shot.energy;
                        if(e.energy <= 0) {
                            e.setState("explode");
                            l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
                        }
                    }
                });
            }, this );

        },
        collidePlayerAndEnemies: function() {
            var l = this.Level[this.currentLevel];
            var that = this;

            l.enemies.forEach( function( e, i ) {
                if( !e || !that.collide( that.player, e ) ) return;
                if( e.state == "normal" ) {
                    that.player.energy -= 500;
                    if( that.player.energy <= 0 ) {
                        that.player.setState("explode");
                        l.Effects.push(new ParticleEffekt(l, that.player.x + that.player.w / 2, that.player.y + that.player.h / 2));
                        that.player.points += e.points;
                    }
                    e.setState("explode");
                    l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
                }
                if(e.state == "extra") {
                    that.player.addExtra(e.extra.name);
                    l.removeEnemy(i);
                }
            });

        },
        runningMainLoop : function() {
            var l = this.Level[this.currentLevel];
            var that = this;

            this.Level[this.currentLevel].background_y--;

            if( l.done ) {
                this.context.drawImage(l.levelComplete, 0, 0, 800, 600, 0, 0, 800, 600);
                this.stop();
                this.stateID = utils.setInterval(this, this.loadNextLevel, this.nextLevelTimer);
                return;
            }

            // l.enemies
            l.enemies.forEach( function( e, i ) {
                if ( !e ) return;
                if ( !e.move( l.background_y + 600 ) ) l.removeEnemy( i );
            });

            this.player.move( 0, 728, l.background_y, l.background_y + 560 );

            this.updateShooting();

            // Detect this.player - Enemy collisions
            if(this.player.state == "normal") {
                this.collidePlayerAndEnemies();
            }

            this.draw();

            // clear Arrays
            l.enemies = l.enemies.filter( function( x ) { return x !== undefined; } );

            // remove all inactive shots
            this.activeShots = this.activeShots.filter( function( shot ) {
                return shot.active;
            } );
        },
        draw: function() {
            var l = this.Level[this.currentLevel];
            var that = this;
            var anim, frame, w, h, proz, amount, bar, t;

            // Draw background
            this.context.drawImage(l.bg, 0, l.background_y, 800, 600, 0, 0, 800, 600);

            // draw enemies

            l.enemies.forEach( function( e, i ) {
                if( !e ) return;
                var anim = l.anims[e.anim];
                var frame = anim[e.animIndex];
                that.context.drawImage(frame, 0, 0, frame.width, frame.height, e.x, e.y - l.background_y, e.w, e.h);
            });
            // draw Shots
            this.activeShots.forEach( function( shot ) {
                var frame = l.anims[shot.anim][shot.animIndex];
                that.context.drawImage(frame, 0, 0, frame.width, frame.height, shot.x, shot.y - l.background_y , frame.width, frame.height);
            });

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
