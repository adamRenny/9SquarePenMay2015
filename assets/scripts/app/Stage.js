define(function(require) {
    var Snap = require('snap');
    var CONSTANTS = require('./Constants');

    var stage = Snap(CONSTANTS.DIMENSIONS.SIZE, CONSTANTS.DIMENSIONS.SIZE);
    stage.prependTo(document.getElementById('place'));

    return stage;
});