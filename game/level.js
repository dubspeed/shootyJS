/*
 * LEVEL
 */

( function( global ) {
    "use strict";

    var addOption = global.utils.addOption;
    var addMethod = global.utils.addMethod;

    global.MasterLevel = Object.create( {}, {
        anims: addOption( {} ),
        intro: addOption( true ),
        done: addOption( false ),
        ticks: addOption( 0 ),
        enemies: addOption( [] ),
        TimeLine: addOption( [] ),
        Extras: addOption( [] ),
        Effects: addOption( [] ),
        lastId: addOption( 0 ),
        register: addMethod(  function(time, command, id) {
            this.TimeLine.push(new Array(time, command, id));
        }),
        addAnim: addMethod( function(name, prefix, suffix, frameCount) {
            if ( this.anims[ name] ) return;
            this.anims[ name ] = Object.create( global.Animation );
            this.anims[ name ].load( name, prefix, suffix, frameCount );
        }),
        executeActionCommand: addMethod( function(action, currentTime, level) {
            var time = action[0],
            command = action[1],
            id = action[2];
            if(currentTime == time)
                try {
                    command(level, id);
                } catch (e) {
                }
        }),
        script: addMethod( function() {
            var level = global.Game.Level[global.Game.currentLevel],
            actions = level.TimeLine;

            for( var a = 0; a < actions.length; a++) {
                level.executeActionCommand(actions[a], level.ticks, level);
            }

            if(level.ticks == level.levelEndTime) {
                level.done = true;
            }
            level.ticks++;
        }),
        setEnemyMoveCommand : addMethod( function(level, para) {
            var f = para[0],
            functions = para[1],
            funcX = functions[0],
            paramX = functions[1],
            funcY = functions[2],
            paramY = functions[3];
            switch (funcX) {
                case undefined:
                    break;
                case "noChange":
                    f.dx = f.noChange;
                break;
                case "linear":
                    f.dx = f.linear;
                f.linearSpeed = paramX;
                break;
                case "sine":
                    f.dx = f.sine;
                f.moveSineAmplitude = paramX;
                break;
                case "parabel":
                    f.dx = f.parabel;
                f.moveParabelAmplitude = paramX;
                break;
            }
            switch (funcY) {
                case undefined:
                    break;
                case "noChange":
                    f.dy = f.noChange;
                break;
                case "linear":
                    f.dy = f.linear;
                f.linearSpeed = paramY;
                break;
                case "sine":
                    f.dy = f.sine;
                f.moveSineAmplitude = paramY;
                break;
                case "parabel":
                    f.dy = f.parabel;
                f.moveParabelAmplitude = paramY;
                break;
            }

        }),
        createEnemy : addMethod( function(anim, pos, relId, parameters, timeline) {
            var i;
            var f = Object.create( global.Enemy ).setOptions( {
                level: this,
                id: this.lastId ++,
                anim: anim,
                x: pos[0],
                y: pos[1]
            } );
            f.fromArray(parameters);
            f.init();
            // TODO enemy position is relative to relID position, calculate
            if (relId !== undefined) ;

            this.enemies.push(f);

            // set enemy movement functions and register triggers
            for ( i = 0; i < timeline.length; i++ ) {
                var t = new global.EnemyEvt();
                t.moveX = timeline[i][0];
                t.paramX = timeline[i][1];
                t.moveY = timeline[i][2];
                t.paramY = timeline[i][3];
                t.time = timeline[i][4];
                f.timeline.push(t);
                this.register(t.time, this.setEnemyMoveCommand, [f, timeline[i]]);
            }

            return (this.lastId - 1);
        }),
        removeEnemy : addMethod( function(index) {
            global.clearInterval(this.enemies[index].shootingTimerId);
            this.enemies[index] = undefined;
        }),
        findEnemy : addMethod( function(id) {
            for( var i = 0; i < this.enemies.length; i++) {
                if(this.enemies[i] === undefined)
                    continue;
                if(this.enemies[i].id == id)
                    if (this.enemies[i].state == "normal")
                        return this.enemies[i];
                else
                    return null;
            }
            return null;
        }),
        addAvailableExtra : addMethod( function (name, anim, probability) {
            var e = {};
            e.name = name;
            e.anim = anim;
            e.probability = probability;
            this.Extras.push(e);
        })

    });

}( this ));
