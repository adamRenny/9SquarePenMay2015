define(function(require) {
    'use strict';

    var CONSTANTS = require('./Constants');
    var stage = require('./Stage');
    var PathParticle = require('./PathParticle');
    var PeriodicPath = require('./PeriodicPath');
    var GLSLMath = require('GLSLMath');
    var TWO_PI = Math.PI * 2;
    var glMatrix = require('glMatrix');
    var mat4 = glMatrix.mat4;

    function ParticleSystem() {
        this.shouldStop = false;
        this.scale = 1;
        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.z = 150;

        this.transform = mat4.create();
        this.build();
    }

    function build() {
        this.paths = [];
        this.particles = [];
        var rotations = 0.33;
        var zDistance = this.z;
        var verticalPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.HALF_SIZE * 0.8, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            rotations, PeriodicPath.AXES.X
        );
        var horizontalPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.HALF_SIZE * 0.8, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            rotations, PeriodicPath.AXES.Y
        );
        var innerPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.QUARTER_SIZE * 0.25, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            1, PeriodicPath.AXES.Z
        );
        var smallerInnerPath = new PeriodicPath(
            CONSTANTS.DIMENSIONS.QUARTER_SIZE * 0.25, CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, zDistance,
            2, PeriodicPath.AXES.Z
        );
        this.paths.push(verticalPath);
        this.paths.push(horizontalPath);
        this.paths.push(innerPath);
        this.paths.push(smallerInnerPath);

        var angleX = TWO_PI * (-1 / 32);
        var angleY = TWO_PI * (-2 / 32);
        var angleZ = TWO_PI * (0 / 16);

        var i = 0;
        var numberOfParticles = 14;
        var step = 1 / numberOfParticles;

        numberOfParticles = 10;
        step = 1 / numberOfParticles;
        var colors = [CONSTANTS.COLORS.WHITE, CONSTANTS.COLORS.YELLOW]
        for (i = 0; i < numberOfParticles; i++) {
            var particle = new PathParticle(colors[i % colors.length], i * step);
            innerPath.particles.push(particle);
            this.particles.push(particle);
        }
        innerPath.rotationX = angleX - TWO_PI * (-4/32);
        innerPath.rotationY = angleY;
        innerPath.rotationZ = angleZ;

        numberOfParticles = 10;
        step = 1 / numberOfParticles;
        for (i = 0; i < numberOfParticles; i++) {
            var particle = new PathParticle(colors[i % colors.length], i * step);
            smallerInnerPath.particles.push(particle);
            this.particles.push(particle);
        }
        smallerInnerPath.rotationX = angleX + TWO_PI * (-6/32);
        smallerInnerPath.rotationY = angleY;
        smallerInnerPath.rotationZ = angleZ;

        numberOfParticles = 14;
        step = 1 / numberOfParticles;

        for (i = 0; i < numberOfParticles; i++) {
            var particle = new PathParticle(CONSTANTS.COLORS.GREEN, i * step);
            verticalPath.particles.push(particle);
            this.particles.push(particle);
        }
        verticalPath.rotationX = angleX;
        verticalPath.rotationY = angleY;
        verticalPath.rotationZ = angleZ;

        for (i = 0; i < numberOfParticles; i++) {
            var particle = new PathParticle(CONSTANTS.COLORS.RED, i * step);
            horizontalPath.particles.push(particle);
            this.particles.push(particle);
        }
        horizontalPath.rotationX = angleX;
        horizontalPath.rotationY = angleY;
        horizontalPath.rotationZ = angleZ;        
    }

    function updateTransform() {
        mat4.identity(this.transform);
        mat4.translate(this.transform, this.transform, [CONSTANTS.DIMENSIONS.HALF_SIZE, CONSTANTS.DIMENSIONS.HALF_SIZE, this.z]);
        mat4.scale(this.transform, this.transform, [this.scale, this.scale, this.scale]);
        mat4.rotateX(this.transform, this.transform, this.rotationX);
        mat4.rotateY(this.transform, this.transform, this.rotationY);
        mat4.rotateZ(this.transform, this.transform, this.rotationZ);
        mat4.translate(this.transform, this.transform, [-CONSTANTS.DIMENSIONS.HALF_SIZE, -CONSTANTS.DIMENSIONS.HALF_SIZE, -this.z]);
    }

    function step(elapsedTimestampInSeconds) {
        this.updateTransform();

        var particles = this.particles;
        var paths = this.paths;

        stage.addClass('hidden');

        // Particle Iteration
        var i = 0;
        var length = paths.length;
        for (i = 0; i < length; i++) {
            var path = paths[i];
            mat4.copy(path.baseTransform, this.transform);
            path.update(elapsedTimestampInSeconds);
        }

        // Z Sorting
        var length = particles.length;
        particles.sort(function(a, b) {
            return GLSLMath.sign(a.z - b.z);
        });

        for (i = 0; i < length; i++) {
            var particle = particles[i];
            particle.svg.remove();
            stage.append(particle.svg);
        }

        stage.removeClass('hidden');
    }

    ParticleSystem.prototype.updateTransform = updateTransform;
    ParticleSystem.prototype.build = build;
    ParticleSystem.prototype.step = step;

    return ParticleSystem;
});