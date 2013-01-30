// Tests für ein Sprite

buster.testCase("Sprite", {
    "should exist": function() {
        assert( window.Sprite );
    },
    "should get an instance of it": function() {
        var sp1 = Object.create( Sprite );
        assert.equals( 0, sp1.energy );
    },
    "init": {
        "should initialize some variables": function() {
            var sp = Object.create( Sprite ).init( {
                x: 10, y: 10, dx: 100, dy: 200
            });
            assert.equals( 10, sp.x );
            assert.equals( 10, sp.y );
            assert.equals( 100, sp.dx );
            assert.equals( 200, sp.dy );
        }
    },
    "method setOptions": {
        "setUp": function() {
            this.sp1 = Object.create( Sprite );
        },
        "should exists": function() {
            assert.isFunction( Sprite.setOptions );
        },
        "returns an object": function() {
            assert.isObject( this.sp1.setOptions( { a: 1 } ) );
        },
        "transfers object values": function() {
            assert.equals( 1, this.sp1.setOptions( { x: 1} ).x );
        },
        "ignores properties wich are not in the original object": function() {
            refute( this.sp1.setOptions( { haus: 1 } ).haus );
        }
    },
    "blinking test:": {
        setUp: function() {
            this.clock = this.useFakeTimers();
            this.sprite = Object.create( Sprite );
        },
        "blink is an object": function() {
            assert.isObject( this.sprite.blink );
        },
        "blink has some methods": function() {
            assert.isFunction( this.sprite.blink.isBlinking );
            assert.isFunction( this.sprite.blink.start );
            assert.isFunction( this.sprite.blink.stop );
        },
        "should have private state": function() {
            this.sprite.blink.start();
            refute.defined( this.sprite.blink.on );
            refute.defined( this.sprite.blink.state );
            refute.defined( this.sprite.blink.freq );
            refute.defined( this.sprite.blink.timeOut );
        },
        "should start and stop blinking": function() {
            this.sprite.blink.start();
            assert( this.sprite.blink.isBlinking() );
            this.sprite.blink.stop();
            refute( this.sprite.blink.isBlinking() );
        },
        "should have a stop callback": function() {
            var called=0;
            function stopCallback() {
                called += 1;
            }
            this.sprite.blink.start( 1000, 10000, stopCallback );
            this.clock.tick(11000);
            assert.equals( 1, called );
        },
        "blinkint timer test:": {
            setUp: function() {
                this.clock = this.useFakeTimers();
                this.spy( utils, "setTimeout" );
                this.spy( utils, "setInterval" );
                this.spy( window, "clearInterval" );
                this.sprite = Object.create( Sprite );
                this.spy( this.sprite.blink, "stop" );
            },
            "should set timer": function() {
                this.sprite.blink.start( 1000, 10000 );
                assert.calledOnce( utils.setTimeout );
                this.clock.tick( 11000 );
                assert.calledOnce( this.sprite.blink.stop );
            },
            "should blink a few times": function() {
                this.sprite.blink.start( 1000, 10000 );
                this.clock.tick( 3000 );
                assert.calledOnce( utils.setInterval );
                assert.equals( 3, this.sprite.blink._blinkCount() );
                this.clock.tick( 6000 );
                assert.equals( 9, this.sprite.blink._blinkCount() );
                this.clock.tick( 2000 ); // 11000 -> stop called
                assert.calledOnce( this.sprite.blink.stop );
                assert.equals( 0, this.sprite.blink._blinkCount() );
            }
        }

    }
});

