
Player = (function( global, parent ) {

    return Object.create( parent, {
        lives: { value: 3 },
        points: { value: 0 },
        doubleshot : { value: false },
        shotFireball : { value: false },
        shotFireballId : { },
        shotFireballFrequency : { value: 1200 },
        shotFireballTime : { value: null },


        init: { value: function( level, options ) {
            this.setOptions( options );
            this.shotId = utils.setInterval(this, this.fireShot, this.shotFrequency);
            this.y += level.background_y;
        }},
        stopBlink: { value: function () {
            this.setState("normal");
        }},
        setState : { value: function(state) {
            this.state = state;
            this.animIndex = 0;
            switch (this.state) {
                case "normal":
                    this.stateNormal();
                break;
                case "explode":
                    this.stateExplode();
                break;
                case "invul":
                    this.stateInvul();
                break;
            }
        }},
        stateNormal : { value: function () {
            this.shooting = true;
        }},
        stateExplode : { value:  function () {
            this.anim = "expl_small";
            this.lives -= 1;
        }},
        stateInvul : { value: function () {
            this.energy = 1000;
            this.anim = "shooty";
            this.shooting = false;
            this.blink.start( this.blinkFrequency, this.blinkTimeOut, this.stopBlink );
        }},

        fireFireball : { value: function() {
            var i, s1;
            s1 = null;
            for( i = 0; i < MAXSHOTS; i++) {
                if(ActiveShots[i].active === false) {
                    s1 = i;
                    break;
                }
            }
            ActiveShots[s1].y = this.y - ActiveShots[s1].h;
            ActiveShots[s1].x = this.x + (this.w / 2) - (ActiveShots[s1].w / 2);
            ActiveShots[s1].active = true;
            ActiveShots[s1].active = true;
            ActiveShots[s1].anim = "shot_fireball";
            ActiveShots[s1].dy = -5;
            ActiveShots[s1].energy = 250;
            ActiveShots[s1].enemy_shot = false;
            this.shotFireballTime = new Date().getTime();
        }},
        fireShot : { value: function() {
            var s1, s2, i;
            if(this.shooting === false)
                return;
            s1 = s2 = null;
            for( i = 0; i < MAXSHOTS; i++) {
                if(ActiveShots[i].active === false) {
                    s1 = i;
                    break;
                }
            }
            if(this.doubleshot) {
                for( i = 0; i < MAXSHOTS; i++) {
                    if(ActiveShots[i].active === false && i != s1) {
                        s2 = i;
                        break;
                    }
                }
            }
            if(s1 !== null) {
                ActiveShots[s1].y = this.y - ActiveShots[s1].h;
                if(this.doubleshot)
                    ActiveShots[s1].x = this.x + (this.w / 2) - (ActiveShots[s1].w / 2) + 10;
                else
                    ActiveShots[s1].x = this.x + (this.w / 2) - (ActiveShots[s1].w / 2);
                ActiveShots[s1].active = true;

                ActiveShots[s1].anim = "shot";
                ActiveShots[s1].dy = -10;
                ActiveShots[s1].energy = 50;
                ActiveShots[s1].enemy_shot = false;
            }
            if(s2 !== null) {
                ActiveShots[s2].y = this.y - ActiveShots[s2].h;
                ActiveShots[s2].x = this.x + (this.w / 2) - (ActiveShots[s2].w / 2) - 10;
                ActiveShots[s2].active = true;

                ActiveShots[s2].anim = "shot";
                ActiveShots[s2].dy = -10;
                ActiveShots[s2].energy = 50;
                ActiveShots[s2].enemy_shot = false;
            }
        }},
        addExtra : { value: function(extraName) {
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
                this.shotFireballId = utils.setInterval(this, this.fireFireball, this.shotFireballFrequency);
            }
        }}

    });
}( this, Sprite ));

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
Player.blink = Blinker;

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

