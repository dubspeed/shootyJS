/*
 * Utils
 */
(function( global ) {

    global.utils = {};

    timeout = function( method, context, callback, delay ) {
        var originalArguments = Array.prototype.slice.call( arguments, 3 );
        return window[ method ]( function() {
            callback.apply( context, originalArguments );
        }, delay );
    };

    global.utils.setInterval = function( context, callback, delay ) {
        return timeout( "setInterval", context, callback, delay );
    };

    global.utils.setTimeout = function( context, callback, delay ) {
        return timeout( "setTimeout", context, callback, delay );
    };

    global.utils.addOption = function( value, writable, enumerable ) {
        if ( typeof enumerable === "undefined" ) enumerable = false;
        if ( typeof writable === "undefined" ) writable = true;
        return {
            value: value,
            writable: writable,
            enumerable: enumerable
        };
    };

    global.utils.addMethod = function( func ) {
        return {
            value: func,
            writable: true,         // needed for sinon.spy
            configurable: true,
            enumerable: false
        };
    };

}( this ));



