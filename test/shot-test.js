buster.testCase( "Shots", {
    "basic tests": {
        "exists": function() {
            assert.isObject( window.Shot );
        },
        "has some inherited attributes": function() {
            var sh = Object.create( window.Shot );
            assert.defined( sh.x );
            assert.defined( sh.y );
            assert.defined( sh.dy );
            assert.defined( sh.energy );
            assert.defined( sh.anim);
            assert.defined( sh.animIndex);
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

    },
    "ActiveShots array": {
        "exists and is an array": function() {
            assert.isArray( window.ActiveShots );
            assert.equals( window.MAXSHOTS, window.ActiveShots.length );
        },
        "all shots are properly initialized": function() {
            for ( var i=0; i < window.MAXSHOTS; i++ ) {
                assert.equals( window.ActiveShots[i].dy, -10 );
                assert.equals( window.ActiveShots[i].anim, "shot" );
                assert.equals( window.ActiveShots[i].energy, 100 );
            }
        }

    }

});
