/*
 * GLOBAL FUNCTIONS / ENTRY
 */
function start_game() {
    Game.init();
    for( var i = 0; i < Game.Level.length; i++) {
        Game.Level[i].init();
    }
    ShotsInit();
    Player.init(Game.Level[0], {
        x: 400, y: 500
    });
    Game.intro();
}

/*
 * GAME
 */
var Game = {
    fps : 1000 / 50,
    animationTimer : 100,
    scriptTimer : 1000,
    Level : [],
    currentLevel : 0,
    nextLevelTimer : 3000,
    fontStyle : "bold 20px sans-serif",
    fontColor : "white",
    init : function() {
        this.canvas = document.getElementById('gcanvas');
        this.context = this.canvas.getContext('2d');
        window.addEventListener('keydown', this.keyDownEvent, false);
        window.addEventListener('keyup', this.keyUpEvent, false);
    },
    start : function() {
        window.clearInterval(this.stateID);
        window.clearInterval(this.animateID);
        window.clearInterval(this.levelScriptID);
        this.stateID = utils.setInterval(this, this.runningMainLoop, this.fps);
        this.animateID = utils.setInterval(this, this.animate, this.animationTimer);
        this.levelScriptID = utils.setInterval(this, this.Level[this.currentLevel].script, this.scriptTimer);
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
        if( isNaN( obj1.x ) || isNaN( obj1.y ) )
            return false;
        if( isNaN( obj2.x ) || isNaN( obj2.y ) )
            return false;
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

    animate : function() {
        var l = this.Level[this.currentLevel];
        var anim = l.anims[Player.anim];
        var e, i;

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
                if(Player.lives === 0)
                    this.gameOver();
                else
                    Player.setState("invul");
            }
            break;
        }

        // animate shot
        for( i = 0; i < MAXSHOTS; i++) {
            anim = l.anims[ActiveShots[i].anim];
            if(ActiveShots[i].animIndex < anim.frameCount)
                ActiveShots[i].animIndex += 1;
            else
                ActiveShots[i].animIndex = 0;
        }

        // animate enemys
        for( i = 0; i < l.Enemies.length; i++) {
            if ( !l.Enemies[i] )
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
                    if ( e.extra )
                        e.setState("extra");
                    else
                        l.removeEnemy(i);
                }
                break;
            }
        }
    },

    keyDownEvent : function(event) {
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
    },

    keyUpEvent : function(event) {
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
            l.Enemies[i].w = l.anims[l.Enemies[i].anim].frames[l.Enemies[i].animIndex].width;
            l.Enemies[i].h = l.anims[l.Enemies[i].anim].frames[l.Enemies[i].animIndex].height;
        }

        if(Player.state == "normal" || Player.state == "invul") {
            // Update Player position
            // add "standard thrust" - move with y plane
            Player.y--;
            if(Player.x < 0)
                Player.x = 0;
            if(Player.x > 728)
                Player.x = 728;
            if(Player.y < l.background_y)
                Player.y = l.background_y;
            if(Player.y > l.background_y + 560)
                Player.y = l.background_y + 560;
            if(Player.x + Player.dx >= 0 &&
               Player.x + Player.dx <= 728 &&
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

        for( i = 0; i < MAXSHOTS; i++) {
            if(ActiveShots[i].active === false)
                continue;
            ActiveShots[i].y += ActiveShots[i].dy;
            if(ActiveShots[i].y <= 0 || ActiveShots[i].y - l.background_y >= 600) {
                ActiveShots[i].active = false;
                continue;
            }

            // Player collides with shot
            if(Player.state == "normal" && this.collide(Player, ActiveShots[i]) && ActiveShots[i].enemy_shot === true) {
                ActiveShots[i].active = false;
                Player.energy -= ActiveShots[i].energy;
                if(Player.energy <= 0) {
                    Player.setState("explode");
                    l.Effects.push(new ParticleEffekt(l, Player.x + Player.w / 2, Player.y + Player.h / 2));
                }
            }

            for( j = 0; j < l.Enemies.length; j++) {
                if( !l.Enemies[j] )
                    continue;
                // Enemy collides with shot
                e = l.Enemies[j];
                if(e.state == "normal" && this.collide(ActiveShots[i], e) && ActiveShots[i].enemy_shot === false) {
                    ActiveShots[i].active = false;
                    Player.points += e.points;
                    e.params.energy -= ActiveShots[i].energy;
                    if(e.params.energy <= 0) {
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
            for( i = 0; i < l.Enemies.length; i++) {
                if( !l.Enemies[i] )
                    continue;
                e = l.Enemies[i];
                if(!this.collide(Player, e))
                    continue;
                if(e.state == "normal") {
                    Player.energy -= 500;
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
        this.context.drawImage(l.bg, 0, l.background_y, 800, 600, 0, 0, 800, 600);

        // draw Enemies
        for( i = 0; i < l.Enemies.length; i++) {
            if( !l.Enemies[i] )
                continue;
            e = l.Enemies[i];
            anim = l.anims[e.anim];
            frame = anim.frames[e.animIndex];
            this.context.drawImage(frame, 0, 0, frame.width, frame.height, e.x, e.y - l.background_y, e.w, e.h);
        }
        // draw Shots
        for( i = 0; i < MAXSHOTS; i++) {
            if(ActiveShots[i].active === true) {
                _ = ActiveShots[i];
                frame = l.anims[_.anim].frames[_.animIndex];
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, ActiveShots[i].x, ActiveShots[i].y - l.background_y , frame.width, frame.height);
            }
        }

        // draw Player
        if(Player.blink.blinkState() === false) {
            anim = l.anims[Player.anim];
            frame = anim.frames[Player.animIndex];
            this.context.drawImage(frame, 0, 0, frame.width, frame.height, Player.x, Player.y - l.background_y, Player.w, Player.h);
        }
        // draw Status + Lives
        w = l.statusBar.width;
        h = l.statusBar.height;
        this.context.drawImage(l.statusBar, 0, 0, w, h, 0, 0, w, h);
        frame = l.anims.shooty.frames[0];
        for( i = 0; i < Player.lives; i++) {
            this.context.drawImage(frame, 0, 0, frame.width, frame.height, (i * 20) + 10, 0, 20, 20);
        }
        this.context.fillStyle = this.fontColor;
        this.context.font = this.fontStyle;
        this.context.fillText(Player.points.toString(), 200, 17);

        // draw Energybar
        bar = l.energyBar;
        proz = (Player.energy / Player.maxEnergy) * 100;
        amount = (600 / 100) * proz;
        for( i = 600; i > 600 - amount; i--) {
            this.context.drawImage(bar, 0, 0, bar.width, bar.height, 0, i, bar.width, bar.height);
        }

        // draw Fireball bar
        if(Player.shotFireball === true) {
            bar = l.fireballBar;
            t = (new Date().getTime() - Player.shotFireballTime);
            proz = (t / Player.shotFireballFrequency) * 100;
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
