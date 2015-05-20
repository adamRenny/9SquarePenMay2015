define(function(require) {
    'use strict';

    var RADIUS = 2;
    var Z_FOR_SCALE = 50;

    var CONSTANTS = require('./Constants');
    var stage = require('./Stage');
    var Snap = require('snap');

    function PathParticle(color, t) {
        this.svg = stage.circle(0, 0, RADIUS);
        this.svg.attr('fill', color);
        this.color = color;

        this.t = t;
        this.x = 0;
        this.y = 0;
        this.z = 0;

        this.transform = new Snap.Matrix();

        this.update();
    }

    function update() {

        // Identity
        this.transform.a = this.transform.d = 1;
        this.transform.b = this.transform.c = this.transform.e = this.transform.f = 0;

        this.transform.translate(this.x, this.y);
        var scale = (this.z / Z_FOR_SCALE) + 1;
        this.transform.scale(scale, scale);

        this.svg.transform(this.transform);
    }

    PathParticle.prototype.update = update;

    return PathParticle;
});