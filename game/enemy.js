/*jshint es5:true */
/*
 * Event, e.g. move
 */
function EnemyEvt() {
    this.time = 0;
    this.moveX = undefined;
    this.paramX = 0;
    this.moveY = undefined;
    this.paramY = 0;
    this.fromArray = function (ar) {
        this.moveX = ar[0];
        this.paramX = ar[1];
        this.moveY = ar[2];
        this.paramY = ar[3];
        this.time = ar[4];
        return this;
    };
}
/*
 * Enemy Parameters
 */

( function( global ) {
    "use strict";

    var addOption = global.utils.addOption;
    var addMethod = global.utils.addMethod;

    global.Enemy = Object.create( global.Sprite, {
        toString: addMethod( function() {
            return "Enemy";
        }),
        level: addOption( null ),
        id: addOption( 0 ),
        time: addOption( 0 ),
        w: { get: function() {
            return this.level && this.anim && this.level.anims[ this.anim ][ 0 ].width;
        } },
        h: { get: function() {
            return this.level && this.anim && this.level.anims[ this.anim ][ 0 ].height;
        } },
        animLoop: addOption( true ),
        timeline: addOption( [] ),
        paramX: addOption( 0 ),
        paramY: addOption( 0 ),
        extra: addOption( null ),
        setExtra: addMethod( function(type) {
            this.extra = type;
            return this;
        }),
        setDefaults: addMethod( function() {
            var t = new EnemyEvt();
            t.time = 0;
            t.moveX = "noChange";
            t.paramX = 0;
            t.moveY = "noChange";
            t.paramY = 0;
            this.timeline.push(t);
        }),
        init: addMethod( function( options) {
            this.setDefaults();
            this.addState( "normal", this.stateNormal );
            this.addState( "explode", this.stateExplode );
            this.addState( "extra", this.stateExtra );
            this.setState( "normal" );
            if ( this.level ) this.extraDropper();
            this.dx = this.noChange;
            this.dy = this.noChange;
            return this;
        }),
        stateNormal: addMethod( function() {
            this.animIndex = 0;
        }),
        stateExplode: addMethod( function() {
            this.animIndex = 0;
            this.anim = "expl_small";
            this.shooting = false;
            this.energy = 0;
            this.animLoop = false;
        }),
        stateExtra: addMethod( function() {
            this.animIndex = 0;
            this.anim = this.extra.anim;
            this.shooting = false;
            this.animLoop = true;
            this.dx = this.noChange;
            this.dy = this.linear;
        }),
        moveParabelValX : addOption( 0.0 ),
        moveParabelPositivX : addOption( true ),
        moveParabelValY : addOption( 0.0 ),
        moveParabelPositivY : addOption( true ),
        shootingTimerId : addOption( null ),
        shootingAnim : addOption( "enemy_shot" ),
        shootingSpeed : addOption( 15 ),
        shootingTimer : addOption( 0 ),
        points : addOption( 0 ),
        fromArray : addMethod( function(ar) {
            this.points = ar[0];
            this.energy = ar[1];
            this.shooting = ar[2];
            this.shootingFrequency = ar[3];
            this.shootingEnergy = ar[4];
            this.shootLeft = ar[5];
            this.shootMiddle = ar[6];
            this.shootRight = ar[7];
        }),
        extraDropper: addMethod( function() {
            function sortByProbability(a, b) {
                return a.probability - b.probability;
            }
            var rnd = Math.random();
            if (rnd > 0.4) return;      // no extra in 60% of the time
            this.setExtra(undefined);
            var ex = this.level.Extras.sort(sortByProbability);
            for(var i = 0; i < ex.length; i++) {
                if(rnd < ex[i].probability) {
                    this.setExtra(ex[i]);
                    break;
                }
            }
        }),
        noChange : addMethod( function(axis) {
            return 0;
        }),
        linear : addMethod( function(axis) {
            if(axis == "x")
                return this.paramX;
            return this.paramY;
        }),
        sine : addMethod( function(axis) {
            var amp;
            if(axis == "x")
                amp = this.paramX;
            else
                amp = this.paramY;
            return Math.sin(this.time) * amp;
        }),
        parabel : addMethod( function(axis) {
            var amp, pval, pos;
            if(axis == "x") {
                amp = this.paramX;
                pval = this.moveParabelValX;
                pos = this.moveParabelPositivX;
            } else {
                amp = this.paramY;
                pval = this.moveParabelValY;
                pos = this.moveParabelPositivY;
            }
            if(pval <= 0.0)
                pos = true;
            if(pval >= 1.0)
                pos = false;
            if(pos)
                pval += 0.01;
            else
                pval -= 0.01;
            if(pos)
                return (pval * pval) * amp;
            else
                return -1 * (pval * pval) * amp;
        }),
        tick : addMethod( function() {
            for(var i = 0; i < this.timeline.length; i++) {
                var t = this.timeline[i];
                if(this.time == t.time) {
                    this.dx = this.setMovementFunction(t.moveX);
                    this.dy = this.setMovementFunction(t.moveY);
                    this.paramX = t.paramX;
                    this.paramY = t.paramY;
                }
            }
            this.time++;
            return [this.dx("x"), this.dy("y")];
        }),
        setMovementFunction : addMethod( function(text) {
            switch (text) {
                case undefined:
                    break;
                case "noChange":
                    return this.noChange;
                case "linear":
                    return this.linear;
                case "sine":
                    return this.sine;
                case "parabel":
                    return this.parabel;
            }
        }),
        shoot : addMethod( function() {
            if(this.shooting)
                return this;
            this.shooting = true;
            this.shootingTimerId = global.utils.setInterval(this, this.doShooting, this.shootingFrequency, this);
            this.shootingTimer = 0;
            return this;
        }),
        doShooting : addMethod( function(obj) {
            if(obj.state != "normal" || obj.shooting === false) {
                global.clearInterval(obj.shootingTimerId);
                return;
            }
            var s = Object.create( global.Shot );
            s.setOptions( {
                anim: obj.shootingAnim,
                dy: obj.shootingSpeed,
                energy: obj.shootingEnergy,
                y: obj.y - s.h,
                x: obj.x + (obj.w / 2) - (s.w / 2),
                enemy_shot: true
            });
            return s;
        }),
        move: addMethod( function( max_y ) {
            var cords;
            if( this.y > max_y ) {
                return false;
            }
            if( this.state != "explode" ) {
                cords = this.tick();
                this.x += cords[0];
                this.y += cords[1];
            }
            return true;
        })

    });
}( this ));
