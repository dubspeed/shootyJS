/*
 * PLAYER
 */
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
Player.shooting = false;
Player.shotFrequency = 300;
Player.shotId = null;
Player.doubleshot = false;
Player.shotFireball = false;
Player.shotFireballId = undefined;
Player.shotFireballFrequency = 1200;
Player.shotFireballTime = null;
// normal || explode || invul
Player.state = "normal";
Player.blinkState = false;
Player.blinkFrequency = 100;
Player.blinkTimeOut = 1500;
Player.blinkId = null;
Player.init = function(level) {
    Player.shotId = window.setInterval(Player.fireShot, Player.shotFrequency);
    Player.y += level.background_y;
}
Player.doBlink = function () {
    if (Player.blinkState == true) Player.blinkState = false;
    else Player.blinkState = true;
}
Player.stopBlink = function () {
    window.clearInterval(Player.blinkId);
    Player.setState("normal");
}
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
}
Player.stateNormal = function () {
    Player.blinkState = false;
    Player.shooting = true;
}
Player.stateExplode = function () {
    Player.anim = "expl_small";
    Player.lives -= 1;
}
Player.stateInvul = function () {
    Player.energy = 1000;
    Player.anim = "shooty";
    Player.shooting = false;
    Player.blinkId = window.setInterval(Player.doBlink, Player.blinkFrequency);
    window.setTimeout(Player.stopBlink, Player.blinkTimeOut);
}

Player.fireFireball = function() {
    s1 = null;
    for( var i = 0; i < MAXSHOTS; i++) {
        if(ActiveShots[i].active == false) {
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
}
Player.fireShot = function() {
    if(Player.shooting == false)
        return;
    s1 = s2 = null;
    for( var i = 0; i < MAXSHOTS; i++) {
        if(ActiveShots[i].active == false) {
            s1 = i;
            break;
        }
    }
    if(Player.doubleshot) {
        for( var i = 0; i < MAXSHOTS; i++) {
            if(ActiveShots[i].active == false && i != s1) {
                s2 = i;
                break;
            }
        }
    }
    if(s1 != null) {
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
    if(s2 != null) {
        ActiveShots[s2].y = Player.y - ActiveShots[s2].h;
        ActiveShots[s2].x = Player.x + (Player.w / 2) - (ActiveShots[s2].w / 2) - 10;
        ActiveShots[s2].active = true;

        ActiveShots[s2].anim = "shot";
        ActiveShots[s2].dy = -10;
        ActiveShots[s2].energy = 50;
        ActiveShots[s2].enemy_shot = false;
    }
}
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
    if(extraName == "extra_fireball" && Player.shotFireball == false) {
        Player.shotFireballTime = new Date().getTime();
        Player.shotFireball = true;
        Player.shotFireballId = window.setInterval(Player.fireFireball, Player.shotFireballFrequency);
    }
}
