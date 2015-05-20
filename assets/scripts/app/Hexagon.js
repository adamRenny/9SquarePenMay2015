define(function(require) {
    'use strict';

    var Snap = require('snap');
    var stage = require('./Stage');

    var TWO_PI = Math.PI * 2;

    function Hexagon(color, x, y, size) {
        this.impl = null;
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.width = 0;
        this.height = 0;

        this.transform = new Snap.Matrix();

        this.setUp();
        this.update();
    }

    function setUp() {
        var points = [];
        var stepSize = TWO_PI / 6;
        var maxY = 0;
        var minY = 0;
        var maxX = 0;
        var minX = 0;
        for (var i = 0; i < 6; i++) {
            points.push.apply(points, [
                Math.cos(stepSize * i) * this.size, Math.sin(stepSize * i) * this.size
            ]);
            maxY = Math.max(maxY, Math.sin(stepSize * i) * this.size);
            minY = Math.min(minY, Math.sin(stepSize * i) * this.size);
            maxX = Math.max(maxX, Math.cos(stepSize * i) * this.size);
            minX = Math.min(minX, Math.cos(stepSize * i) * this.size);
        }
        this.width = Math.abs(maxX - minX);
        this.height = Math.abs(maxY - minY);

        this.impl = stage.polygon(points);
        this.impl.attr({
            fill: this.color,
            stroke: this.color
        });
    }

    function update() {
        this.transform.a = this.transform.d = 1;
        this.transform.b = this.transform.c = this.transform.e = this.transform.f = 0;

        this.transform.translate(this.x, this.y);
        this.impl.attr('transform', this.transform);
    }

    Hexagon.prototype.setUp = setUp;
    Hexagon.prototype.update = update;

    return Hexagon;
});