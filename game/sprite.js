(function( global ) {
    "use strict";

    var addOption = global.utils.addOption;
    var addMethod = global.utils.addMethod;

    global.Sprite = Object.create({}, {
        x: addOption( 0 ),
        y: addOption( 0 ),
        dx: addOption( 0 ),
        dy: addOption( 0 ),
        speedX: addOption( 0 ),
        speedY: addOption( 0 ),
        energy: addOption( 0 ),
        maxEnergy: addOption( 0 ),
        anim: addOption( "" ),
        animIndex: addOption( 0 ),
        shooting: addOption( false ),
        shotFrequency: addOption( 0 ),
        shootLeft: addOption( null ),
        shootMiddle: addOption( null ),
        shootRight: addOption( null ),
        shotId: addOption( 0 ),
        doubleshot: addOption( false ),
        state: addOption( "normal" ),
        init: addMethod( function( options ) {
            return this.setOptions( options );
        } ),
        // TODO: not compiler safe -> the compiler may have renamed the properties
        // they are not named the same
        setOptions: addMethod( function( options ) {
            for ( var opt in options ) {
                if ( typeof this[ opt ] != "undefined" ) {
                    this[ opt ] = options[ opt ];
                }
            }
            return this;
        } )
    });

    global.BlinkingSprite = Object.create( global.Sprite, {
        isBlinking: addOption( false ),
        blinkState: addOption( false ),
        blinkCount: addOption( 0 ),
        blink: addMethod( function() {
            this.blinkState ^= 1;
            this.blinkCount += 1;
        } ),
        blinkStart: addMethod( function( _freq, _timeOut, _stopCallback ) {
            this.isBlinking = true;
            _freq = _freq || 1000;
            _timeOut = _timeOut || 10000;
            global.utils.setTimeout( this, this.blinkStop, _timeOut );
            this._blinkTimer = global.utils.setInterval( this, this.blink, _freq );
            this._stopCallback = _stopCallback;
        } ),
        blinkStop: addMethod( function() {
            this.isBlinking = false;
            global.clearInterval( this._blinkTimer );
            this.blinkCount = 0;
            if ( this._stopCallback && this._stopCallback instanceof Function ) {
                this._stopCallback();
            }
        } ),
        _stopCallback: addOption( null ),
        _blinkTimer: addOption( null )
    });



}( this ));
