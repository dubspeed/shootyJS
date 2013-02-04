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
    "ActiveShots": {
        setUp: function() {
            this.as = ActiveShots.getInstance();
        },
        "exists and is an object": function() {
            assert.isObject( window.ActiveShots );
        },
        "has a push method": function() {
            assert.isFunction( this.as.push );
        },
        "has a kill method": function() {
            assert.defined( this.as.kill );
        },
        "push returns an index": function() {
            assert.isNumber( this.as.push( 3 ) );
            assert.isNumber( this.as.push( 4 ) );
        },
        "can access elements via index": function () {
            var idx = this.as.push( 3 );
            assert.defined( this.as[ idx ] );
            assert.equals( this.as[ idx ], 3 );
        },
        "can kill and clear elements": function () {
            this.as.kill( 0 );
            this.as.cleanup();
            refute.defined( this.as[0] );
        },
        "index is not enumerable": function() {
            this.as.push( 3 );
            this.as.push( 2 );
            var count = 0;
            for ( var id in this.as ) {
                count ++;
                refute.equals( id, "index" );
            }
            assert( count, 2 );
        }
    }

});
