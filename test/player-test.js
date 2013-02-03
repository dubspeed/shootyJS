buster.testCase( "Player" , {
    "basic test": {
        "can be created": function () {
            assert.isObject( window.Player );
            assert.isObject( Object.create( Player ) );
        },
        "has some properties": function() {
            var pl = Object.create( Player );
            assert.defined( pl.lives );
            assert.defined( pl.points );
        }
    }
   });

