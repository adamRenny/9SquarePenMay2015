define(function(require) {
    'use strict';

    var RADIUS = 2;
    var Z_FOR_SCALE = 50;

    var CONSTANTS = require('./Constants');
    var stage = require('./Stage');
    var Snap = require('snap');

    function Particle(color, x, y, z) {
        this.svg = stage.circle(0, 0, RADIUS);
        this.svg.attr('fill', color);
        this.color = color;

        this.x = x;
        this.y = y;
        this.z = z;

        this.vx = 0;
        this.vy = 0;
        this.vz = 0;

        this.transform = new Snap.Matrix();

        this.update();
    }

    function setSpeed(x, y, z) {
        this.vx = x;
        this.vy = y;
        this.vz = z;
    }

    function reset(color, x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
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

    function step(elapsed) {
        this.x = this.x + this.vx * elapsed;
        this.y = this.y + this.vy * elapsed;
        this.z = this.z + this.vz * elapsed;
        this.update();
    }

    Particle.prototype.setSpeed = setSpeed;
    Particle.prototype.reset = reset;
    Particle.prototype.update = update;
    Particle.prototype.step = step;

    return Particle;
});