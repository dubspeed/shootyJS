/*jshint es5:true globalstrict:true */
/*global buster assert refute*/
// Test things on Object for ES5 features

"use strict";

function standardTest( testCase ) {
    assert( testCase.o.hasOwnProperty( "a" ) );
    refute( Object.getOwnPropertyDescriptor( testCase.o, "a" ).enumerable );
    var count = 0;
    for ( var p in testCase.o ) count++;
    assert.equals( count, 0 );
}

buster.testCase("Object", {
    setUp: function() {
        this.o = Object.create( {}, {
            a: { value: 13, enumerable: false, writable: true },
            setA: { value: function( v ) { this.a = v; }, enumerable: false }
        });
    },
    "setting a property as non-enumerable": function() {
        standardTest( this );
    },
    "assigning a new value leaves the property non-enumerable": function() {
        this.o.a = 14;
        standardTest( this );
    },
    "assigning a new method via a method": function() {
        this.o.setA( 15 );
        standardTest( this );
    }
});
