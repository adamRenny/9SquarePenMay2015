define(function(require) {
    'use strict';

    var CONSTANTS = require('./Constants');
    
    var PathParticle = require('./PathParticle');
    var PeriodicPath = require('./PeriodicPath');

    var MILLISECONDS_PER_SECOND = 1000;
    var THRESHOLD = (MILLISECONDS_PER_SECOND/60) * 15;
    var TWO_PI = Math.PI * 2;

    function Visual() {
        this.shouldStop = false;

        this.build();
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
    Visual.prototype.run = run;

    return Visual;
});