/*jshint es5:true */

( function( global ) {
    "use strict";

    var addMethod = global.utils.addMethod;
    var addOption = global.utils.addOption;
    var Game = global.Game;

    global.Shot = Object.create( global.Sprite, {
        w: { get: function() {
            return ( Game && Game.Level && Game.currentLevel && Game.Level[Game.currentLevel].anims.shot.frames[0].w ) || 0;
        } },
        h: { get: function() {
            return ( Game && Game.Level && Game.currentLevel && Game.Level[Game.currentLevel].anims.shot.frames[0].h ) || 0;
        } },
        active: addOption( false ),
        enemy_shot: addOption( false )
    } );

    var activeShotsSingleton = Object.create( {}, {
        index: addOption( 0, true, false),
        dead: addOption( [], true, false),
        push: addMethod( function( val ) {
            this[ this.index.toString() ] = val;
            this.index += 1;
            return this.index - 1;
        }),
        kill: addMethod( function( id ) {
            this.dead.push( id );
        }),
        cleanup: addMethod( function() {
            for (var i = 0; i < this.dead.length; i++ ) {
                delete this[ this.dead[i] ];
            }
            this.dead = [];
        })
    });

    global.ActiveShots = Object.create( {}, {
        getInstance: addMethod( function() { return activeShotsSingleton; } )
    });
}( this ));


