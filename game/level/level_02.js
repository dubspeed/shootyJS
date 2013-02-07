/*Level = Object.create(MasterLevel);
Level.name = "02";
(Level.gameOver = new Image()).src = "gfx/game_over.png";
(Level.levelComplete =  new Image()).src = "gfx/level_complete.png";
(Level.bg = new Image()).src = "gfx/level1_bg.png";
(Level.energyBar = new Image()).src = "gfx/energybar.png";
(Level.fireballBar = new Image()).src = "gfx/fireball_timer.png";
(Level.statusBar = new Image()).src = "gfx/statusbar.png";
Level.ParticleGfx = new Array ();
(img = new Image()).src = "gfx/particles/particle_1.png";
Level.ParticleGfx.push( img );
(img = new Image()).src = "gfx/particles/particle_2.png";
Level.ParticleGfx.push( img );

Level.background_y = 9400;  // TODO add Screen size
Level.levelEndTime = 1;    // ticks

Level.introText = new Array();
Level.introText.push("After the descruction of planet earth by evil aliens,");
Level.introText.push("you swear revenge!");

Level.init = function() {
    this.addAnim("expl_small", "gfx/explo_small/explo", "png", 5);
    this.addAnim("shooty", "gfx/shooty/shooty", "png", 1);
    this.addAnim("shooty_left", "gfx/shooty_left/shooty_left", "png", 1);
    this.addAnim("shooty_right", "gfx/shooty_right/shooty_right", "png", 1);
    this.addAnim("shot", "gfx/shot/shot", "png", 1);
    this.addAnim("enemy_1", "gfx/enemy_1/feind", "png", 1);
    this.addAnim("enemy_2", "gfx/enemy_2/ufo", "png", 1);
    this.addAnim("enemy_3", "gfx/enemy_3/enemy", "png", 1);
    this.addAnim("enemy_6", "gfx/enemy_6/en", "png", 1);
    this.addAnim("enemy_7", "gfx/enemy_7/en7", "png", 1);
    this.addAnim("enemy_shot", "gfx/enemy_shot_1/shot", "png", 1);
    this.addAnim("extra_energy", "gfx/extra_energy/energy", "png", 20);
    this.addAnim("extra_doubleshot", "gfx/extra_doubleshot/shot", "png", 20);
    this.addAnim("extra_live", "gfx/extra_live/live", "png", 20);
    this.addAnim("extra_fireball", "gfx/extra_fireball/fireball", "png", 20);
    this.addAnim("shot_fireball", "gfx/shot_fireball/fb", "png", 20);
    this.addAnim("asteroid_1", "gfx/asteroid_1/as", "png", 1);
    this.addAnim("asteroid_2", "gfx/asteroid_2/as2", "png", 1);
    this.addAnim("asteroid_3", "gfx/asteroid_3/as3", "png", 1);
    this.addAnim("asteroid_4", "gfx/asteroid_4/as4", "png", 1);
    this.addAnim("asteroid_5", "gfx/asteroid_5/as5", "png", 1);

    this.addAvailableExtra ("extra_energy", "extra_energy", 0.8);
    this.addAvailableExtra ("extra_doubleshot", "extra_doubleshot", 0.6);
    this.addAvailableExtra ("extra_live", "extra_live", 0.2);
    this.addAvailableExtra ("extra_fireball", "extra_fireball", 0.4);

    en1 = this.createEnemy ("enemy_6", [400, -20], undefined,
        [["sine", undefined, 1, 0], [, 3, 0]], [100, 200, 0]);



}
Game.Level.push(Level);
*/
