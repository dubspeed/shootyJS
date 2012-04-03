/*
 * GLOBAL FUNCTIONS / ENTRY
 */
function start_game() {
    Game.init();
    for( var i = 0; i < Game.Level.length; i++)
        Game.Level[i].init();
    ShotsInit();
    Player.init(Game.Level[0]);
    Game.intro();
}

/*
 * GAME
 */
var Game = { };
Game.fps = 1000 / 50;
Game.animationTimer = 100;
Game.scriptTimer = 1000;
Game.Level = new Array();
Game.currentLevel = 0;
Game.nextLevelTimer = 3000;
Game.fontStyle = "bold 20px sans-serif";
Game.fontColor = "white";
Game.init = function() {
    Game.canvas = document.getElementById('gcanvas');
    Game.context = Game.canvas.getContext('2d');
    window.addEventListener('keydown', Game.keyDownEvent, false);
    window.addEventListener('keyup', Game.keyUpEvent, false);
};
Game.start = function() {
    window.clearInterval(Game.stateID);
    window.clearInterval(Game.animateID);
    window.clearInterval(Game.levelScriptID);
    Game.stateID = window.setInterval(Game.runningMainLoop, Game.fps);
    Game.animateID = window.setInterval(Game.animate, Game.animationTimer);
    Game.levelScriptID = window.setInterval(Game.Level[Game.currentLevel].script, Game.scriptTimer);
}
Game.gameOver = function() {
    window.clearInterval(Game.stateID);
    Game.stateID = window.setInterval(Game.gameOverMainLoop, Game.fps);
}
Game.intro = function() {
    window.clearInterval(Game.stateID);
    Game.stateID = window.setInterval(Game.gameIntroMainLoop, Game.fps);
    window.setTimeout(Game.start, 10); //10000
}
Game.loadNextLevel = function() {
    if(Game.currentLevel < Game.Level.length - 1) {
        Game.currentLevel++;
        Game.Level[Game.currentLevel].init();
        //Game.Level[Game.currentLevel].Enemies = new Array();
        Game.intro();
    } else {
        Game.gameOver();
    }
    return;
}
Game.collide = function(obj1, obj2) {
    // Bounding Box collision
    if(obj1.y + obj1.h < obj2.y)
        return false;
    if(obj1.y > obj2.y + obj2.h)
        return false;
    if(obj1.x + obj1.w < obj2.x)
        return false;
    if(obj1.x > obj2.x + obj2.w)
        return false;
    return true;
}
Game.animate = function() {
    l = Game.Level[Game.currentLevel];
    anim = l.anims[Player.anim];

    switch (Player.state) {
        case "normal":
        case "invul":
            if(Player.animIndex < anim.frameCount)
                Player.animIndex += 1;
            else
                Player.animIndex = 0;
            break;
        case "explode":
            if(Player.animIndex < anim.frameCount) {
                Player.animIndex += 1;
            } else {
                if(Player.lives == 0)
                    Game.gameOver();
                else
                    Player.setState("invul");
            }
            break;
    }

    // animate shot
    for( var i = 0; i < MAXSHOTS; i++) {
        anim = l.anims[ActiveShots[i].anim];
        if(ActiveShots[i].animIndex < anim.frameCount)
            ActiveShots[i].animIndex += 1;
        else
            ActiveShots[i].animIndex = 0;
    }

    // animate enemys
    for( var i = 0; i < l.Enemies.length; i++) {
        if(l.Enemies[i] == undefined)
            continue;
        e = l.Enemies[i];
        anim = l.anims[e.anim];

        switch (e.state) {
            case "normal":
            case "extra":
                if(e.animIndex < anim.frameCount) {
                    e.animIndex += 1;
                } else {
                    e.animIndex = 0;
                }
                break;
            case "explode":
                if(e.animIndex < anim.frameCount) {
                    l.Enemies[i].animIndex += 1;
                } else {
                    if(e.extra != undefined)
                        e.setState("extra");
                    else
                        l.removeEnemy(i);
                }
                break;
        }
    }
}
Game.keyDownEvent = function(event) {
    switch (event.keyCode) {
        case 37:
            // Left
            Player.dx = -Player.speedX;
            break;

        case 38:
            // Up
            Player.dy = -Player.speedY;
            break;

        case 39:
            // Right
            Player.dx = Player.speedX;
            break;

        case 40:
            // Down
            Player.dy = Player.speedY;
            break;
    }
}
Game.keyUpEvent = function(event) {
    switch (event.keyCode) {
        case 37:
        // left & right
        case 39:
            Player.dx = 0;
            break;

        case 38:
        // Up and Down
        case 40:
            Player.dy = 0;
            break;
    }
}
Game.gameOverMainLoop = function() {
    Game.context.drawImage(Game.Level[Game.currentLevel].gameOver, 0, 0, 800, 600, 0, 0, 800, 600);
    return;
}
Game.gameIntroMainLoop = function() {
    l = Game.Level[Game.currentLevel];
    // Draw background
    Game.context.drawImage(l.bg, 0, l.background_y, 800, 600, 0, 0, 800, 600);

    Game.context.fillStyle = Game.fontColor;
    Game.context.font = Game.fontStyle;
    for( var i = 0; i < l.introText.length; i++) {
        Game.context.fillText(l.introText[i], 100, 200 + (i * 29));
    }
    return;
}
Game.runningMainLoop = function() {
    l = Game.Level[Game.currentLevel];
    Game.Level[Game.currentLevel].background_y--;
        
    if(l.done == true) {
        Game.context.drawImage(l.levelComplete, 0, 0, 800, 600, 0, 0, 800, 600);
        window.clearInterval(Game.stateID);
        Game.stateID = window.setInterval(Game.loadNextLevel, Game.nextLevelTimer);
        return;
    }

    // l.Enemies
    for( var i = 0; i < l.Enemies.length; i++) {
        if(l.Enemies[i] == undefined)
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
        l.Enemies[i].w = l.anims[l.Enemies[i].anim].frames[l.Enemies[i].animIndex].width;
        l.Enemies[i].h = l.anims[l.Enemies[i].anim].frames[l.Enemies[i].animIndex].height;
    }

    if(Player.state == "normal" || Player.state == "invul") {
        // Update Player position
        // add "standard thrust" - move with y plane
        Player.y--;
        if(Player.x < 0)
            Player.x = 0;
        if(Player.x > 760)
            Player.x = 760;
        if(Player.y < l.background_y)
            Player.y = l.background_y;
        if(Player.y > l.background_y + 560)
            Player.y = l.background_y + 560;
        if(Player.x + Player.dx >= 0 && 
            Player.x + Player.dx <= 760 && 
            Player.y + Player.dy >= l.background_y && 
            Player.y + Player.dy <= l.background_y + 560) {
                
            Player.x += Player.dx;
            Player.y += Player.dy;
        }
        Player.anim = "shooty";
        if(Player.dx < 0) {
            Player.anim = "shooty_left";
        } else if(Player.dx > 0) {
            Player.anim = "shooty_right";
        }
    }

    Player.w = l.anims[Player.anim].frames[Player.animIndex].width;
    Player.h = l.anims[Player.anim].frames[Player.animIndex].height;

    // Update shots
    /*for( var i = 0; i < l.Enemies.length; i++) {
     if(l.Enemies[i] == undefined)
     continue;
     e = l.Enemies[i];
     e.shootingTimer++;
     if(e.shootingTimer >= e.shootingFrequency) {
     l.Enemies[i].doShooting(l.Enemies[i]);
     e.shootingTimer = 0;
     }
     }
     */
    for( var i = 0; i < MAXSHOTS; i++) {
        if(ActiveShots[i].active == false)
            continue;
        ActiveShots[i].y += ActiveShots[i].dy;
        if(ActiveShots[i].y <= 0 || ActiveShots[i].y >= 600) {
            ActiveShots[i].active = false;
            continue;
        }

        // Player collides with shot
        if(Player.state == "normal" && Game.collide(Player, ActiveShots[i]) && ActiveShots[i].enemy_shot == true) {
            ActiveShots[i].active = false;
            Player.energy -= ActiveShots[i].energy;
            if(Player.energy <= 0) {
                Player.setState("explode");
                l.Effects.push(new ParticleEffekt(l, Player.x + Player.w / 2, Player.y + Player.h / 2));
            }
        }

        for( j = 0; j < l.Enemies.length; j++) {
            if(l.Enemies[j] == undefined)
                continue;
            // Enemy collides with shot
            e = l.Enemies[j];
            if(e.state == "normal" && Game.collide(ActiveShots[i], e) && ActiveShots[i].enemy_shot == false) {
                ActiveShots[i].active = false;
                Player.points += e.points;
                e.energy -= ActiveShots[i].energy;
                if(e.energy <= 0) {
                    e.setState("explode");
                    l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
                    break;
                } else {
                    continue;
                }
            }
        }
    }

    // Detect Player - Enemy collisions
    if(Player.state == "normal") {
        for( var i = 0; i < l.Enemies.length; i++) {
            if(l.Enemies[i] == undefined)
                continue;
            e = l.Enemies[i];
            if(!Game.collide(Player, e))
                continue;
            if(e.state == "normal") {
                Player.energy -= 500
                if(Player.energy <= 0) {
                    Player.setState("explode");
                    l.Effects.push(new ParticleEffekt(l, Player.x + Player.w / 2, Player.y + Player.h / 2));
                    Player.points += e.points;
                }
                e.setState("explode");
                l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
            }
            if(e.state == "extra") {
                // apply extra to player
                Player.addExtra(e.extra.name);
                l.removeEnemy(i);
            }
        }
    }
    // Draw background
    Game.context.drawImage(l.bg, 0, l.background_y, 800, 600, 0, 0, 800, 600);

    // draw Enemies
    for( var i = 0; i < l.Enemies.length; i++) {
        if(l.Enemies[i] == undefined)
            continue;
        e = l.Enemies[i];
        anim = l.anims[e.anim];
        frame = anim.frames[e.animIndex];
        Game.context.drawImage(frame, 0, 0, frame.width, frame.height, e.x, e.y - l.background_y, e.w, e.h);
    }
    // draw Shots
    for( var i = 0; i < MAXSHOTS; i++) {
        if(ActiveShots[i].active == true) {
            _ = ActiveShots[i];
            frame = l.anims[_.anim].frames[_.animIndex];
            Game.context.drawImage(frame, 0, 0, frame.width, frame.height, ActiveShots[i].x, ActiveShots[i].y, frame.width, frame.height);
        }
    }

    // draw Player
    if(Player.blinkState == false) {
        anim = l.anims[Player.anim];
        frame = anim.frames[Player.animIndex];
        Game.context.drawImage(frame, 0, 0, frame.width, frame.height, Player.x, Player.y - l.background_y, Player.w, Player.h);
    }
    // draw Status + Lives
    w = l.statusBar.width;
    h = l.statusBar.height;
    Game.context.drawImage(l.statusBar, 0, 0, w, h, 0, 0, w, h);
    frame = l.anims["shooty"].frames[0];
    for( var i = 0; i < Player.lives; i++) {
        Game.context.drawImage(frame, 0, 0, frame.width, frame.height, (i * 20) + 10, 0, 20, 20);
    }
    Game.context.fillStyle = Game.fontColor;
    Game.context.font = Game.fontStyle;
    Game.context.fillText(Player.points.toString(), 200, 17);

    // draw Energybar
    bar = l.energyBar;
    proz = (Player.energy / Player.maxEnergy) * 100;
    amount = (600 / 100) * proz;
    for( var i = 600; i > 600 - amount; i--) {
        Game.context.drawImage(bar, 0, 0, bar.width, bar.height, 0, i, bar.width, bar.height);
    }

    // draw Fireball bar
    if(Player.shotFireball == true) {
        bar = l.fireballBar;
        t = (new Date().getTime() - Player.shotFireballTime);
        proz = (t / Player.shotFireballFrequency) * 100;
        amount = (600 / 100) * proz;
        for( var i = 600; i > 600 - amount; i--) {
            Game.context.drawImage(bar, 0, 0, bar.width, bar.height, 800 - bar.width, i, bar.width, bar.height);
        }
    }

    // draw Particles
    for( var i = 0; i < l.Effects.length; i++) {
        if(l.Effects[i].enable) {
            l.Effects[i].moveParticles();
            l.Effects[i].drawParticles(Game.context);
        }
    }

    // draw Debug collsion rects
    //Game.context.strokeRect(Player.x, Player.y, Player.w, Player.h);
    //Game.context.strokeRect(Feind[0].x, Feind[0].y, Feind[0].w, Feind[0].h);
    return;
}