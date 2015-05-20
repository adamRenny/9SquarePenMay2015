define(function(require) {
    'use strict';

    var CONSTANTS = require('./Constants');
    var stage = require('./Stage');
    var PathParticle = require('./PathParticle');
    var PeriodicPath = require('./PeriodicPath');
    var Snap = require('snap');
    var Hexagon = require('./Hexagon');

    var MILLISECONDS_PER_SECOND = 1000;
    var THRESHOLD = (MILLISECONDS_PER_SECOND/60) * 15;
    var TWO_PI = Math.PI * 2;

    function Visual() {
        this.shouldStop = false;

        // this.build();
        this.buildHexes();
    }

    function build() {
        this.paths = [];
        var rotations = 0.32;
        var zDistance = 150;
        var verticalPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.HALF_SIZE * 0.8, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            rotations, PeriodicPath.AXES.X
        );
        var horizontalPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.HALF_SIZE * 0.8, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            rotations, PeriodicPath.AXES.Y
        );
        var innerPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.QUARTER_SIZE * 0.35, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            rotations, PeriodicPath.AXES.Z
        );
        this.paths.push(verticalPath);
        this.paths.push(horizontalPath);
        this.paths.push(innerPath);

        var angleX = TWO_PI * (-1 / 32);
        var angleY = TWO_PI * (-2 / 32);
        var angleZ = TWO_PI * (0 / 16);

        var i = 0;
        var numberOfParticles = 7;
        var step = 1 / numberOfParticles;

        numberOfParticles = 3;
        step = 1 / numberOfParticles;
        for (i = 0; i < numberOfParticles; i++) {
            innerPath.particles.push(new PathParticle(CONSTANTS.COLORS.YELLOW, i * step));
        }
        innerPath.reposition(angleX, angleY, angleZ);

        numberOfParticles = 7;
        step = 1 / numberOfParticles;

        for (i = 0; i < numberOfParticles; i++) {
            verticalPath.particles.push(new PathParticle(CONSTANTS.COLORS.GREEN, i * step));
        }
        verticalPath.reposition(angleX, angleY, angleZ);

        for (i = 0; i < numberOfParticles; i++) {
            horizontalPath.particles.push(new PathParticle(CONSTANTS.COLORS.RED, i * step));
        }
        horizontalPath.reposition(angleX, angleY, angleZ);        
    }

    function buildHexes() {
        var group = stage.g();
        var colors = [
            CONSTANTS.COLORS.RED,
            // CONSTANTS.COLORS.WHITE,
            CONSTANTS.COLORS.BLUE,
            CONSTANTS.COLORS.GREEN,
            CONSTANTS.COLORS.YELLOW
        ];
        var numberOfHexes = 4;
        var initial = new Hexagon(colors[Math.round(Math.random() * colors.length)], 0, 0, 20);
        var hexes = [initial];
        var numberOfHexesWide = Math.ceil(CONSTANTS.DIMENSIONS.SIZE / initial.width) + 2;
        var numberOfHexesHigh = Math.ceil(CONSTANTS.DIMENSIONS.SIZE / initial.height) + 2;
        
        initial.impl.remove();
        var x = 0;
        var y = 0;
        var isOffset = false;
        var dx = initial.width * 0.74;
        var dy = initial.height * 0.998;
        var yOffset = initial.height * 0.5;
        for (x = 0; x < numberOfHexesWide; x++) {
            var hexX = x * dx;
            for (y = 0; y < numberOfHexesHigh; y++) {
                var hexY = y * dy;
                if (isOffset) {
                    hexY = hexY - yOffset;
                }
                var hex = new Hexagon(colors[Math.round(Math.random() * colors.length)], hexX, hexY, 20);
                hexes.push(hex);
                hex.impl.remove();
                group.append(hex.impl);
            }

            isOffset = !isOffset;
        }

        var mat = new Snap.Matrix();
        mat.scale(2, 2);
        group.transform(mat);
    }

    function run() {
        var lastTimestamp = (new Date()).getTime();
        var visual = this;

        var paths = this.paths;

        function step() {
            if (visual.shouldStop) {
                return;
            }
            requestAnimationFrame(step);

            var currentTimestamp = (new Date()).getTime();
            var elapsedTimestamp = currentTimestamp - lastTimestamp;
            lastTimestamp = currentTimestamp;
            if (elapsedTimestamp >= THRESHOLD) {
                return;
            }

            var elapsedTimestampInSeconds = elapsedTimestamp / MILLISECONDS_PER_SECOND;

            var i = 0;
            var length = paths.length;
            for (i = 0; i < length; i++) {
                var path = paths[i];
                path.update(elapsedTimestampInSeconds);
            }
        }

        step();
    }

    Visual.prototype.build = build;
    Visual.prototype.buildHexes = buildHexes;
    Visual.prototype.run = run;

    return Visual;
});