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
    }
});

buster.testCase("BlinkingSprite", {
    "blinking test:": {
        setUp: function() {
            this.clock = this.useFakeTimers();
            this.sprite = Object.create( BlinkingSprite );
        },
        "blink is an object": function() {
            assert.isObject( this.sprite);
        },
        "blink has some methods": function() {
            assert.isFunction( this.sprite.blink );
            assert.isFunction( this.sprite.blinkStart );
            assert.isFunction( this.sprite.blinkStop );
        },
        "should start and stop blinking": function() {
            this.sprite.blinkStart();
            assert( this.sprite.isBlinking );
            this.sprite.blinkStop();
            refute( this.sprite.isBlinking );
        },
        "should have a stop callback": function() {
            var called=0;
            function stopCallback() {
                called += 1;
            }
            this.sprite.blinkStart( 1000, 10000, stopCallback );
            this.clock.tick( 11000 );
            assert.equals( 1, called );
        },
        "stop callback should run with origin this": function() {
            var testObj = null;
            var sprite = Object.create( BlinkingSprite, {
                stopCallback: { value: function() {
                    testObj = this;
                }, enumerable: true }
            });
            sprite.blinkStart( 1000, 10000, sprite.stopCallback );
            this.clock.tick( 11000 );
            assert.same( sprite, testObj );
        },
        "blinkint timer test:": {
            setUp: function() {
                this.clock = this.useFakeTimers();
                this.spy( utils, "setTimeout" );
                this.spy( utils, "setInterval" );
                this.spy( window, "clearInterval" );
                this.sprite = Object.create( BlinkingSprite );
                this.spy( this.sprite, "blinkStop" );
            },
            "should set timer": function() {
                this.sprite.blinkStart( 1000, 10000 );
                assert.calledOnce( utils.setTimeout );
                this.clock.tick( 11000 );
                assert.calledOnce( this.sprite.blinkStop );
            },
            "should blink a few times": function() {
                this.sprite.blinkStart( 1000, 10000 );
                this.clock.tick( 3000 );
                assert.calledOnce( utils.setInterval );
                assert.equals( 3, this.sprite.blinkCount );
                this.clock.tick( 6000 );
                assert.equals( 9, this.sprite.blinkCount );
                this.clock.tick( 2000 ); // 11000 -> stop called
                assert.calledOnce( this.sprite.blinkStop );
                assert.equals( 0, this.sprite.blinkCount );
            }
        }

    }
});

