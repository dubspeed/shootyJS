var config = module.exports;

config.shooty = {
    env: "browser",        // or "node"
    rootPath: "../",
    sources: [
        "game/utils.js",
        "game/sprite.js",
        "game/shots.js",
        "game/player.js",
        "game/**/*.js"
    ],
    tests: [
        "test/*-test.js"
    ]
};
