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

}( this ));



