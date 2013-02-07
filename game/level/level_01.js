Level = Object.create( MasterLevel );
Level.name = "01";
(Level.gameOver = new Image()).src = "gfx/game_over.png";
(Level.levelComplete =  new Image()).src = "gfx/level_complete.png";
(Level.bg = new Image()).src = "gfx/level1_tile_bg.png";
(Level.energyBar = new Image()).src = "gfx/energybar.png";
(Level.fireballBar = new Image()).src = "gfx/fireball_timer.png";
(Level.statusBar = new Image()).src = "gfx/statusbar.png";
Level.ParticleGfx = new Array ();
(img = new Image()).src = "gfx/particles/particle_1.png";
Level.ParticleGfx.push( img );
(img = new Image()).src = "gfx/particles/particle_2.png";
Level.ParticleGfx.push( img );

Level.levelEndTime = 30;    // ticks

Level.introText = new Array();
Level.introText.push("After the descruction of planet earth by evil aliens,");
Level.introText.push("you swear revenge!");
Level.introText.push("");
Level.introText.push("Use your arrow keys to control the ship,");
Level.introText.push("collect extras to improve shields and firepower!");

Level.init = function( canvas ) {
    this.background_y = 10000;
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

	// ASTEROIDS
	en0 = this.createEnemy('asteroid_1',[207, 8642], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0]]);
	en1 = this.createEnemy('asteroid_1',[279, 8636], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en2 = this.createEnemy('asteroid_1',[342, 8665], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en3 = this.createEnemy('asteroid_3',[258, 8724], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en4 = this.createEnemy('asteroid_1',[478, 8604], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en5 = this.createEnemy('asteroid_1',[557, 8603], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en6 = this.createEnemy('asteroid_2',[589, 8712], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en7 = this.createEnemy('asteroid_1',[652, 8562], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 4,0],]);
	en8 = this.createEnemy('asteroid_1',[227, 8951], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en9 = this.createEnemy('asteroid_1',[316, 8537], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en10 = this.createEnemy('asteroid_1',[411, 8495], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en11 = this.createEnemy('asteroid_3',[521, 8511], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en12 = this.createEnemy('asteroid_1',[267, 8551], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en13 = this.createEnemy('asteroid_1',[298, 8764], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en14 = this.createEnemy('asteroid_1',[298, 8764], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en15 = this.createEnemy('asteroid_2',[698, 8943], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en16 = this.createEnemy('asteroid_1',[365, 8394], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en17 = this.createEnemy('asteroid_1',[430, 8352], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en18 = this.createEnemy('asteroid_2',[436, 8348], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en19 = this.createEnemy('asteroid_2',[112, 8306], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en20 = this.createEnemy('asteroid_2',[672, 8227], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 4,0],]);
	en21 = this.createEnemy('asteroid_2',[383, 8160], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en22 = this.createEnemy('asteroid_2',[258, 8222], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en23 = this.createEnemy('asteroid_2',[155, 8113], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en24 = this.createEnemy('asteroid_2',[606, 8131], undefined, [100, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en25 = this.createEnemy('asteroid_3',[389.63827233364003, 9062.331937269373], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en26 = this.createEnemy('asteroid_2',[400.0629432164329, 9047.865264735077], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en27 = this.createEnemy('asteroid_1',[429.4071862730645, 9048.536266891471], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en28 = this.createEnemy('asteroid_5',[485.7742376102997, 9000.231359710038], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en29 = this.createEnemy('asteroid_4',[444.1499039710806, 9048.603008281509], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en30 = this.createEnemy('asteroid_4',[204.76825781358562, 9133.155331903568], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en31 = this.createEnemy('asteroid_3',[172.97096013989213, 9168.53967567937], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en32 = this.createEnemy('asteroid_4',[130.1067564883514, 9107.26703753242], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en33 = this.createEnemy('asteroid_1',[97.00221011146621, 9057.691087754714], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 4,0],]);
	en34 = this.createEnemy('asteroid_3',[104.10039239250096, 9084.240755471756], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en35 = this.createEnemy('asteroid_5',[344.6858601911627, 8777.26129746083], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en36 = this.createEnemy('asteroid_4',[342.9237335438482, 8725.532169832326], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en37 = this.createEnemy('asteroid_3',[396.5814144089616, 8691.433355961739], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en38 = this.createEnemy('asteroid_4',[400.91306985756455, 8677.345865439793], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en39 = this.createEnemy('asteroid_5',[418.7255330165688, 8707.869492639727], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en40 = this.createEnemy('asteroid_4',[148.92771179512513, 8636.818839127427], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en41 = this.createEnemy('asteroid_5',[177.98618841840351, 8642.755989084744], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en42 = this.createEnemy('asteroid_5',[228.49311260563138, 8659.653068580183], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en43 = this.createEnemy('asteroid_1',[184.5055564976243, 8594.091193307604], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 4,0],]);
	en44 = this.createEnemy('asteroid_1',[119.91211900108999, 8586.036793262216], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en45 = this.createEnemy('asteroid_4',[509.5818518555956, 8545.287971994472], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en46 = this.createEnemy('asteroid_1',[545.5797537131796, 8500.834881163575], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);
	en47 = this.createEnemy('asteroid_3',[587.2390525394324, 8476.484616937849], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 3,0],]);
	en48 = this.createEnemy('asteroid_2',[535.7147535159622, 8436.376125243793], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 1,0],]);
	en49 = this.createEnemy('asteroid_4',[603.3563010662132, 8372.508821909918], undefined, [50, 200, false,600, 200, 'none', 'none', 'none'], [['noChange', 0,'linear', 2,0],]);

	// enemy 1
    en50 = this.createEnemy('enemy_1',[377, 7793], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', -2,'linear', 2,600]]);
    en51 = this.createEnemy('enemy_1',[377, 7693], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', -2,'linear', 2,610]]);
    en52 = this.createEnemy('enemy_1',[377, 7593], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', -2,'linear', 2,620]]);
    en53 = this.createEnemy('enemy_1',[377, 7493], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', -2,'linear', 2,630]]);
    en54 = this.createEnemy('enemy_1',[377, 7393], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', -2,'linear', 2,640]]);
    en55 = this.createEnemy('enemy_1',[377, 7293], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', 2,'linear', 2,800]]);
    en56 = this.createEnemy('enemy_1',[377, 7193], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', 2,'linear', 2,810]]);
    en57 = this.createEnemy('enemy_1',[377, 7093], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', 2,'linear', 2,820]]);
    en58 = this.createEnemy('enemy_1',[377, 6993], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', 2,'linear', 2,830]]);
    en59 = this.createEnemy('enemy_1',[377, 6893], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', 2,'linear', 2,840]]);
    en60 = this.createEnemy('enemy_1',[377, 6793], undefined, [100, 200, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 20,'linear', 2,0],['linear', 2,'linear', 2,850]]);

	// enemy 2
    en60 = this.createEnemy('enemy_2',[300, 6593], undefined, [100, 1000, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 0,'linear', 2,0],['noChange', 10,'linear', 1,1000]]);
    en61 = this.createEnemy('enemy_2',[400, 6593], undefined, [100, 1000, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 0,'linear', 2,0],]);
    en62 = this.createEnemy('enemy_2',[500, 6593], undefined, [100, 1000, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 0,'linear', 2,0],['noChange', 10,'linear', 1,1000]]);
    en63 = this.createEnemy('enemy_2',[600, 6593], undefined, [100, 1000, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 0,'linear', 2,0],]);
    en64 = this.createEnemy('enemy_2',[200, 6593], undefined, [100, 1000, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 0,'linear', 2,0],['noChange', 10,'linear', 1,1000]]);
	en66 = this.createEnemy('enemy_2',[100, 6593], undefined, [100, 1000, true,600, 200, 'none', 'shot_1', 'none'], [['noChange', 0,'linear', 2,0],]);

	// enemy 3
	en70 = this.createEnemy('enemy_3',[400, 6200], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 2,1150]]);
	en71 = this.createEnemy('enemy_3',[300, 6100], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 3,1150]]);
	en72 = this.createEnemy('enemy_3',[500, 6100], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 3,1150]]);
	en73 = this.createEnemy('enemy_3',[200, 6000], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 4,1150]]);
	en73 = this.createEnemy('enemy_3',[600, 6000], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 4,1150]]);

	// enemy_6

	en80 = this.createEnemy('enemy_6',[400, 5800], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 2,1250]]);
	en81 = this.createEnemy('enemy_6',[250, 5800], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 3,1250]]);
	en82 = this.createEnemy('enemy_6',[550, 5800], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 3,1250]]);
	en83 = this.createEnemy('enemy_6',[100, 5800], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 4,1250]]);
	en83 = this.createEnemy('enemy_6',[650, 5800], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 4,1250]]);

	// enemy_7
	en90 = this.createEnemy('enemy_7',[400, 5600], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 2,1150]]);
	en91 = this.createEnemy('enemy_7',[300, 5600], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 3,1150]]);
	en92 = this.createEnemy('enemy_7',[500, 5600], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 3,1150]]);
	en93 = this.createEnemy('enemy_7',[200, 5600], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 4,1150]]);
	en93 = this.createEnemy('enemy_7',[600, 5600], undefined, [100, 1000, true,600, 200, 'shot_1', 'shot_1', 'shot_1'], [['noChange', 0,'linear', 2,0],['noChange', 0,'linear', 4,1150]]);


}
game.Level.push(Level);
