buster.testCase( "Shots", {
    "basic tests": {
        "exists": function() {
            assert.isObject( window.Shot );
        },
        "has some inherited attributes": function() {
            var sh = Object.create( window.Shot );
            assert.defined( sh.x, "x" );
            assert.defined( sh.y, "y" );
            assert.defined( sh.dy, "dy" );
            assert.defined( sh.energy, "energy" );
            assert.defined( sh.anim, "anim" );
        },
        "has some own properties": function() {
            var sh = Object.create( window.Shot );
            assert.defined( sh.w );
            assert.defined( sh.h );
            assert.defined( sh.active );
            assert.defined( sh.enemy_shot );
        },
        "has a init method": function() {
            var sh = Object.create( window.Shot );
            assert.isFunction( sh.init );
        }

    }

});
