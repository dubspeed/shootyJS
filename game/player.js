
Player = (function( global ) {
    "use strict";

    // basic tasks of the Player object
    // 1. state machine -> redundant with enemy / -> sprite /-> linked to animations
    // 2. fire fireball and shots -> enemies can do, too -> sprite
    // 3. movement ( in main)
    //
    var addOption = global.utils.addOption;
    var addMethod = global.utils.addMethod;

    return Object.create( global.BlinkingSprite, {
        lives: addOption( 3 ),
        points: addOption( 0 ),

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
        })

    });
}( this ));

/*
var Player = {};
Player.x = 400;
Player.y = 500;
Player.dx = 0;
Player.dy = 0;
Player.speedX = 10;
Player.speedY = 10;
Player.points = 0;
Player.animIndex = 0;
Player.anim = "shooty";
Player.lives = 3;
Player.energy = 1000;
Player.maxEnergy = 2500;
Player.shooting = true;
Player.shotFrequency = 300;
Player.shotId = null;

Player.doubleshot = false;
Player.shotFireball = false;
Player.shotFireballId = undefined;
Player.shotFireballFrequency = 1200;
Player.shotFireballTime = null;


// normal || explode || invul
Player.state = "normal";
Player.blinkFrequency = 100;
Player.blinkTimeOut = 1500;
utils.mixin( Blinker, Player );

Player.init = function(level) {
    Player.shotId = utils.setInterval(this, Player.fireShot, Player.shotFrequency);
    Player.y += level.background_y;
};

Player.stopBlink = function () {
    Player.setState("normal");
};
Player.setState = function(state) {
    Player.state = state;
    Player.animIndex = 0;
    switch (Player.state) {
        case "normal":
            Player.stateNormal();
            break;
        case "explode":
            Player.stateExplode();
            break;
        case "invul":
            Player.stateInvul();
            break;
    }
};
Player.stateNormal = function () {
    Player.shooting = true;
};
Player.stateExplode = function () {
    Player.anim = "expl_small";
    Player.lives -= 1;
};
Player.stateInvul = function () {
    Player.energy = 1000;
    Player.anim = "shooty";
    Player.shooting = false;
    Player.blink.start( Player.blinkFrequency, Player.blinkTimeOut, Player.stopBlink );
};

Player.fireFireball = function() {
    var i, s1;
    s1 = null;
    for( i = 0; i < MAXSHOTS; i++) {
        if(ActiveShots[i].active === false) {
            s1 = i;
            break;
        }
    }
    ActiveShots[s1].y = Player.y - ActiveShots[s1].h;
    ActiveShots[s1].x = Player.x + (Player.w / 2) - (ActiveShots[s1].w / 2);
    ActiveShots[s1].active = true;
    ActiveShots[s1].active = true;
    ActiveShots[s1].anim = "shot_fireball";
    ActiveShots[s1].dy = -5;
    ActiveShots[s1].energy = 250;
    ActiveShots[s1].enemy_shot = false;
    Player.shotFireballTime = new Date().getTime();
};
Player.fireShot = function() {
    var s1, s2, i;
    if(Player.shooting === false)
        return;
    s1 = s2 = null;
    for( i = 0; i < MAXSHOTS; i++) {
        if(ActiveShots[i].active === false) {
            s1 = i;
            break;
        }
    }
    if(Player.doubleshot) {
        for( i = 0; i < MAXSHOTS; i++) {
            if(ActiveShots[i].active === false && i != s1) {
                s2 = i;
                break;
            }
        }
    }
    if(s1 !== null) {
        ActiveShots[s1].y = Player.y - ActiveShots[s1].h;
        if(Player.doubleshot)
            ActiveShots[s1].x = Player.x + (Player.w / 2) - (ActiveShots[s1].w / 2) + 10;
        else
            ActiveShots[s1].x = Player.x + (Player.w / 2) - (ActiveShots[s1].w / 2);
        ActiveShots[s1].active = true;

        ActiveShots[s1].anim = "shot";
        ActiveShots[s1].dy = -10;
        ActiveShots[s1].energy = 50;
        ActiveShots[s1].enemy_shot = false;
    }
    if(s2 !== null) {
        ActiveShots[s2].y = Player.y - ActiveShots[s2].h;
        ActiveShots[s2].x = Player.x + (Player.w / 2) - (ActiveShots[s2].w / 2) - 10;
        ActiveShots[s2].active = true;

        ActiveShots[s2].anim = "shot";
        ActiveShots[s2].dy = -10;
        ActiveShots[s2].energy = 50;
        ActiveShots[s2].enemy_shot = false;
    }
};
Player.addExtra = function(extraName) {
    if(extraName == "extra_live") {
        Player.lives += 1;
    }
    if(extraName == "extra_energy") {
        Player.energy += 100;
    }
    if(extraName == "extra_doubleshot") {
        Player.doubleshot = true;
    }
    if(extraName == "extra_fireball" && Player.shotFireball === false) {
        Player.shotFireballTime = new Date().getTime();
        Player.shotFireball = true;
        Player.shotFireballId = utils.setInterval(this, Player.fireFireball, Player.shotFireballFrequency);
    }
};
*/

