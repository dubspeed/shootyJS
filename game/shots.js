/*
 * SHOTS
 */
MAXSHOTS = 70;
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
