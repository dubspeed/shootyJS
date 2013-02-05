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

}( this ));


