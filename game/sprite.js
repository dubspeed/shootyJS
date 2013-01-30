Blinker = (function( global ) {
    var on = false;
    var state = false;
    var freq = 0;
    var timeOut = 0;
    var timerId = null;
    var _blinkCount = 0;
    var stopCallback = null;
    function blink() { state ^= 1; _blinkCount += 1; }

    return {
        isBlinking: function() {
            return on;
        },
        blinkState: function() {
            return state;
        },
        start: function( _freq, _timeOut, _stopCallback ) {
            on = true;
            freq = _freq || 1000;
            timeOut = _timeOut || 10000;
            window.utils.setTimeout( this, this.stop, _timeOut );
            timerId = window.utils.setInterval( this, blink, _freq );
            stopCallback = _stopCallback;
        },
        stop: function() {
            on = false;
            window.clearInterval( timerId );
            _blinkCount = 0;
            if ( stopCallback && stopCallback instanceof Function ) stopCallback();
        },
        _blinkCount: function() {
            return _blinkCount;
        }
    };
}( this ));



(function( global ) {

    global.Sprite = {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0,
        speedX: 0,
        speedY: 0,
        energy: 0,
        maxEnergy: 0,
        anim: "",
        animIndex: 0,
        shooting: false,
        shotFrequency: 0,
        shootLeft: null,
        shootMiddle: null,
        shootRight: null,
        shotId: 0,
        doubleshot: false,
        state: "normal",
        blink: global.Blinker,
        init: function( options ) {
            return this.setOptions( options );
        },
        setOptions: function( options ) {
            for ( var opt in options ) {
                //if ( this[ opt ] ) {
                    this[ opt ] = options[ opt ];
                //}
            }
            return this;
        }
    };


}( this ));
