buster.testCase( "Enemy", {
    "basic tests": {
        "exists etc.": function() {
            assert.isObject( Enemy );
            assert.equals( Object.getPrototypeOf( Enemy ), "Sprite" );
            assert.equals( Enemy.toString(), "Enemy" );
        }
    }
});
