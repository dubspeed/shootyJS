// Tests für ein Sprite

buster.testCase("Animation", {
    setUp: function() {
        this.anim = Object.create( Animation );
        this.stub( window, "Image" );
    },
    "has all properties and methods": function() {
        assert.isFunction( this.anim.load );
        assert.defined( this.anim.length );
        assert.isFunction( this.anim.next );
    },
    "tries to load images ascny": function( ) {
        this.anim.load( "test", "test", "gif", 1 );
        assert.equals( this.anim._name, "test" );
        assert.equals( this.anim._suffix, "gif" );
        assert.equals( this.anim._prefix, "test" );
        assert.defined( this.anim[0] );
        assert.equals( this.anim[0].src, "test_00.gif" );
    },
    "only enumerates the images": function() {
        var count = 0;
        this.anim.load( "test", "test", "gif", 1 );
        for (var prop in this.anim ) {
            count++;
        }
        assert.equals( 1, count );
        assert.equals( count, this.anim.length );
    },
    "next() loops over the images": function() {
        this.anim.load( "test", "test", "png", 2 );
        var idx = 0;
        idx = this.anim.next( idx );
        assert.equals( idx, 1 );
        idx = this.anim.next( idx );
        assert.equals( idx, 0 );
        //assert.equals( this.anim.next( idx ), 1 );
        //assert.equals( this.anim.next( idx ), 0 );
    },
    "next() throws if animation is not loaded": function() {
        var that = this;
        assert.exception( function() {
            that.anim.next();
        });
    },
    "lastFrame is true only on the last animation frame": function() {
        this.anim.load( "test", "test", "png", 2 );
        var idx = 0;
        refute( this.anim.lastFrame );
        idx = this.anim.next( idx );
        refute( this.anim.lastFrame );
        idx = this.anim.next( idx );
        assert( this.anim.lastFrame );
        idx = this.anim.next( idx );
        refute( this.anim.lastFrame );
    }
});

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
        },
        "toString() returns 'Sprite' ": function() {
            assert.equals( Sprite.toString(), "Sprite" );
        }
    },
     "state machine": {
        setUp: function() {
            this.cb = {
                explode: function() {  },
                normal: function() {  }
            };
            this.spyNormal = this.spy( this.cb, "normal" );
            this.sp = Object.create( window.Sprite );
        },
        "has a state property": function() {
            assert.defined( this.sp.state );
        },
        "has a _states once you add a state": function() {
            refute.isObject( this.sp._states );
            this.sp.addState( "normal", function() {} );
            assert.isObject( this.sp._states );
        },
        "has a setState Method": function() {
            assert.isFunction( this.sp.setState );
        },
        "has a addState Method": function() {
            assert.isFunction( this.sp.addState );
        },
        "has a resetStates Method": function () {
            assert.isFunction( this.sp.resetStates );
        },
        "can not add a state twice": function() {
            var that = this;
            this.sp.addState( "normal", this.cb.normal );
            assert.exception( function() {
                that.sp.addState( "normal" );
            });
        },
        "can set and query states": function() {
            this.sp.resetStates();
            this.sp.addState( "explode", this.cb.explode );
            this.sp.addState( "normal", this.cb.normal );
            this.sp.setState( "explode" );
            assert.equals( this.sp.state, "explode" );
            this.sp.setState( "normal" );
            assert.equals( this.sp.state, "normal" );
        },
        "throws on wrong states": function() {
            var that = this;
            assert.exception( function() {
                that.sp.setState( "nonsense" );
            });
        },
        "calls a callback when a state is set": function() {
            this.sp.resetStates();
            this.sp.addState( "explode", this.cb.explode );
            this.sp.addState( "normal", this.cb.normal );
            this.sp.setState( "explode" );
            this.sp.setState( "normal" );
            assert.equals( this.spyNormal.callCount, 1 );
        },
        "calls the callback only once for one state": function() {
            this.sp.resetStates();
            this.sp.addState( "explode", this.cb.explode );
            this.sp.addState( "normal", this.cb.normal );
            this.sp.setState( "normal" );
            this.sp.setState( "normal" );
            assert.equals( this.spyNormal.callCount, 1 );
        },
        "resets all states": function () {
            this.sp.addState( "explode", this.cb.explode );
            this.sp.resetStates();
            assert.equals( this.sp._states, window.utils.addOption( {} ) );
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

