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

    global.ActiveShots = [];
    global.MAXSHOTS = 70;

    for( var i = 0; i < global.MAXSHOTS; i++ ) {
        global.ActiveShots.push( Object.create( global.Shot ).init( {
            anim: "shot",
            dy: -10,
            energy: 100
        }) );
    }

}( this ));

/* MAXSHOTS = 70;
ActiveShots = [];
function ShotsInit () {
    for( var i = 0; i < MAXSHOTS; i++) {
        ActiveShots[i] = {};
        ActiveShots[i].animIndex = 0;
        ActiveShots[i].anim = "shot";
        ActiveShots[i].active = false;
        ActiveShots[i].x = ActiveShots[i].y = 0;
        ActiveShots[i].dy = -10;
        ActiveShots[i].w = Game.Level[Game.currentLevel].anims.shot.frames[0].width;
        ActiveShots[i].h = Game.Level[Game.currentLevel].anims.shot.frames[0].height;
        ActiveShots[i].energy = 100;
        ActiveShots[i].enemy_shot = false;
    }
}
*/
