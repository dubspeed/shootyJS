/*
 * GLOBAL FUNCTIONS / ENTRY
 */
function start_game() {
    Game.init();
    for( var i = 0; i < Game.Level.length; i++) {
        Game.Level[i].init();
    }
    player = Object.create( Player ).setOptions( {
        x: 400, y: 500,
        speedX: 10, speedY: 10,
        anim: "shooty",
        lives: 3,
        energy: 1000,
        maxEnergy: 2500,
        shooting: true,
        shotFrequency: 300,
        state: "normal"
    });
    player.startShooting();
    Game.intro();
}
( function( global ) {

    var ActiveShots = global.ActiveShots.getInstance();
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
            var anim = l.anims[player.anim];
            var e, i;
            var shot, shotID;

            switch (player.state) {
                case "normal":
                    case "invul":
                    if(player.animIndex < anim.frameCount)
                player.animIndex += 1;
                else
                    player.animIndex = 0;
                break;
                case "explode":
                    if(player.animIndex < anim.frameCount) {
                    player.animIndex += 1;
                } else {
                    if(player.lives === 0)
                        this.gameOver();
                    else
                        player.setState("invul");
                }
                break;
            }

            // animate shot
            for ( shotID in ActiveShots ) {
                shot = ActiveShots[ shotID ];
                anim = l.anims[ shot.anim ];
                if ( shot.animIndex < anim.frameCount )
                    shot.animIndex += 1;
                else
                    shot.animIndex = 0;
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
                    player.dx = -player.speedX;
                break;

                case 38:
                    // Up
                    player.dy = -player.speedY;
                break;

                case 39:
                    // Right
                    player.dx = player.speedX;
                break;

                case 40:
                    // Down
                    player.dy = player.speedY;
                break;
            }
        },

        keyUpEvent : function(event) {
            switch (event.keyCode) {
                case 37:
                    // left & right
                    case 39:
                    player.dx = 0;
                break;

                case 38:
                    // Up and Down
                    case 40:
                    player.dy = 0;
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
                l.Enemies[i].w = l.anims[l.Enemies[i].anim].frames[l.Enemies[i].animIndex].width;
                l.Enemies[i].h = l.anims[l.Enemies[i].anim].frames[l.Enemies[i].animIndex].height;
            }

            if(player.state == "normal" || player.state == "invul") {
                // Update player position
                // add "standard thrust" - move with y plane
                player.y--;
                if(player.x < 0)
                    player.x = 0;
                if(player.x > 728)
                    player.x = 728;
                if(player.y < l.background_y)
                    player.y = l.background_y;
                if(player.y > l.background_y + 560)
                    player.y = l.background_y + 560;
                if(player.x + player.dx >= 0 &&
                   player.x + player.dx <= 728 &&
                       player.y + player.dy >= l.background_y &&
                           player.y + player.dy <= l.background_y + 560) {

                    player.x += player.dx;
                    player.y += player.dy;
                }
                player.anim = "shooty";
                if(player.dx < 0) {
                    player.anim = "shooty_left";
                } else if(player.dx > 0) {
                    player.anim = "shooty_right";
                }
            }

            player.w = l.anims[player.anim].frames[player.animIndex].width;
            player.h = l.anims[player.anim].frames[player.animIndex].height;

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

            for( shotID in ActiveShots ) {
                shot = ActiveShots[ shotID ];
                shot.y += shot.dy;
                if ( shot.y <= 0 ) { //TODO|| shot.y - l.background_y >= 400 ) {
                    //console.log( shotID );
                    ActiveShots.kill( shotID );
                    //continue;
                }

                // player collides with shot
                if(player.state == "normal" && this.collide(player, shot) && shot.enemy_shot === true) {
                    shot.active = false;
                    player.energy -= shot.energy;
                    if(player.energy <= 0) {
                        player.setState("explode");
                        l.Effects.push(new ParticleEffekt(l, player.x + player.w / 2, player.y + player.h / 2));
                    }
                }

                for( j = 0; j < l.Enemies.length; j++) {
                    if( !l.Enemies[j] )
                        continue;
                    // Enemy collides with shot
                    e = l.Enemies[j];
                    if(e.state == "normal" && this.collide(shot. e) && shot.enemy_shot === false) {
                        shot.active = false;
                        player.points += e.points;
                        e.params.energy -= shot.energy;
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

            ActiveShots.cleanup();

            // Detect player - Enemy collisions
            if(player.state == "normal") {
                for( i = 0; i < l.Enemies.length; i++) {
                    if( !l.Enemies[i] )
                        continue;
                    e = l.Enemies[i];
                    if(!this.collide(player, e))
                        continue;
                    if(e.state == "normal") {
                        player.energy -= 500;
                        if(player.energy <= 0) {
                            player.setState("explode");
                            l.Effects.push(new ParticleEffekt(l, player.x + player.w / 2, player.y + player.h / 2));
                            player.points += e.points;
                        }
                        e.setState("explode");
                        l.Effects.push(new ParticleEffekt(l, e.x + e.w / 2, e.y + e.h / 2));
                    }
                    if(e.state == "extra") {
                        // apply extra to player
                        player.addExtra(e.extra.name);
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
            for ( shotID in ActiveShots ) {
                shot = ActiveShots[ shotID ];
                frame = l.anims[shot.anim].frames[shot.animIndex];
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, shot.x, shot.y - l.background_y , frame.width, frame.height);
            }

            // draw playeplayer
            if(player.blinkState === false) {
                anim = l.anims[player.anim];
                frame = anim.frames[player.animIndex];
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, player.x, player.y - l.background_y, player.w, player.h);
            }
            // draw Status + Lives
            w = l.statusBar.width;
            h = l.statusBar.height;
            this.context.drawImage(l.statusBar, 0, 0, w, h, 0, 0, w, h);
            frame = l.anims.shooty.frames[0];
            for( i = 0; i < player.lives; i++) {
                this.context.drawImage(frame, 0, 0, frame.width, frame.height, (i * 20) + 10, 0, 20, 20);
            }
            this.context.fillStyle = this.fontColor;
            this.context.font = this.fontStyle;
            this.context.fillText(player.points.toString(), 200, 17);

            // draw Energybar
            bar = l.energyBar;
            proz = (player.energy / player.maxEnergy) * 100;
            amount = (600 / 100) * proz;
            for( i = 600; i > 600 - amount; i--) {
                this.context.drawImage(bar, 0, 0, bar.width, bar.height, 0, i, bar.width, bar.height);
            }

            // draw Fireball bar
            if(player.shotFireball === true) {
                bar = l.fireballBar;
                t = (new Date().getTime() - player.shotFireballTime);
                proz = (t / player.shotFireballFrequency) * 100;
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
