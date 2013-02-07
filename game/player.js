
Player = (function( global ) {
    "use strict";

    var addOption = global.utils.addOption;
    var addMethod = global.utils.addMethod;

    return Object.create( global.BlinkingSprite, {
        lives: addOption( 3 ),
        points: addOption( 0 ),
        blinkFrequency: addOption( 300 ),
        blinkTimeOut: addOption( 1500 ),
        w: { get: function() {
            return this.level && this.anim && this.level.anims[ this.anim ][ this.animIndex ].width;
        } },
        h: { get: function() {
            return this.level && this.anim && this.level.anims[ this.anim ][ this.animIndex ].height;
        } },

        init: addMethod( function( ) {
            this.addState( "normal", this.stateNormal );
            this.addState( "explode", this.stateExplode );
            this.addState( "invul", this.stateInvul );
            this.setState( "normal" );
            return this;
        }),
        startShooting: addMethod( function() {
            this.shotId = global.utils.setInterval(this, this.fireShot, this.shotFrequency);
        }),
        setLevel: addMethod( function( level ) {
            Object.defineProperty( this, "level", addOption( level ) );
            this.y += level.background_y;
        }),
        stopBlink: addMethod( function () {
            this.setState("normal");
        }),
        stateNormal : addMethod( function () {
            this.animIndex = 0;
            this.shooting = true;
        }),
        stateExplode : addMethod(  function () {
            this.animIndex = 0;
            this.anim = "expl_small";
            this.lives -= 1;
        }),
        stateInvul : addMethod( function () {
            this.animIndex = 0;
            this.energy = 1000;
            this.anim = "shooty";
            this.shooting = false;
            this.blinkStart( this.blinkFrequency, this.blinkTimeOut, this.stopBlink );
        }),

        shotFireball : addOption( false ),
        shotFireballId : addOption( null ),
        shotFireballFrequency : addOption( 1200 ),
        shotFireballTime : addOption( null ),

        fireFireball : addMethod( function() {
            var shot = Object.create( global.Shot );
            shot.setOptions( {
                y: this.y - shot.h,
                x: this.x + (this.w / 2) - (shot.w / 2),
                active: true,
                anim: "shot_fireball",
                dy: -5,
                energy: 250,
                enemy_shot: false
            });
            this.shotFireballTime = new Date().getTime();
            return shot;
        }),
        fireShot : addMethod( function() {
            var shot1 = null,
                shot2 = null;
            if ( ! this.shooting ) return {};
            shot1 = Object.create( global.Shot );
            shot1.setOptions( {
                y: this.y - shot1.h,
                x: this.x + ( this.w / 2 ) - ( shot1.w / 2 ),
                active: true,
                anim: "shot",
                dy: -10,
                energy: 50
            });

            if ( this.doubleshot ) {
                shot1.x += 10;
                shot2 = Object.create( global.Shot );
                shot2.setOptions( {
                    y: this.y - shot2.w,
                    x: this.x + ( this.w / 2) - ( shot2.w / 2 ) + 10,
                    active: true,
                    anim: "shot",
                    dy: -10,
                    energy: 50
                });
            }
            return { shot1: shot1, shot2: shot2 };
        }),
        addExtra : addMethod( function(extraName) {
            if(extraName == "extra_live") {
                this.lives += 1;
            }
            if(extraName == "extra_energy") {
                this.energy += 100;
            }
            if(extraName == "extra_doubleshot") {
                this.doubleshot = true;
            }
            if(extraName == "extra_fireball" && this.shotFireball === false) {
                this.shotFireballTime = new Date().getTime();
                this.shotFireball = true;
                this.shotFireballId = global.utils.setInterval(this, this.fireFireball, this.shotFireballFrequency);
            }
        }),
        move: addMethod( function( min_x, max_x, min_y, max_y ) {
              if(this.state == "normal" || this.state == "invul") {
                // Update this position
                // add "standard thrust" - move with y plane
                this.y--;
                if( this.x <= min_x ) this.x = min_x;
                if( this.x >= max_x ) this.x = max_x;
                if( this.y <= min_y ) this.y = min_y;
                if( this.y >= max_y ) this.y = max_y;
                if( this.x + this.dx >= min_x && this.x + this.dx <= max_x && this.y + this.dy >= min_y && this.y + this.dy <= max_y) {
                    this.x += this.dx;
                    this.y += this.dy;
                }
                this.anim = "shooty";
                if( this.dx < 0 ) this.anim = "shooty_left";
                else if( this.dx > 0 ) this.anim = "shooty_right";
            }

        })

    });
}( this ));

