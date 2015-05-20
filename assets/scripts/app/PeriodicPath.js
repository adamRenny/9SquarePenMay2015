define(function(require) {
    'use strict';

    var CONSTANTS = require('./Constants');
    var stage = require('./Stage');
    var Snap = require('snap');
    var glMatrix = require('glMatrix');

    var AXES = {
        X: 0,
        Y: 1,
        Z: 2
    };

    var ROTATION = Math.PI * 2;

    function PeriodicPath(radius, centerX, centerY, centerZ, rotationsPerSecond, axis) {
        this.radius = radius;
        this.particles = [];
        this.rotationsPerSecond = rotationsPerSecond;
        this.axis = axis;
        this.centerX = centerX;
        this.centerY = centerY;
        this.centerZ = centerZ;

        this.transform = glMatrix.mat4.create();
    }

    function reposition(x, y, z) {
        glMatrix.mat4.identity(this.transform);
        glMatrix.mat4.translate(
            this.transform,
            this.transform,
            [this.centerX, this.centerY, this.centerZ]
        );
        glMatrix.mat4.rotateX(this.transform, this.transform, x);
        glMatrix.mat4.rotateY(this.transform, this.transform, y);
        glMatrix.mat4.rotateZ(this.transform, this.transform, z);
    }

    function update(elapsed) {

        var additionalTime = this.rotationsPerSecond * elapsed;
        
        switch (this.axis) {
            case AXES.X:
                this.applyAboutXAxis(additionalTime);
                break;
            case AXES.Y:
                this.applyAboutYAxis(additionalTime);
                break;
            case AXES.Z:
                this.applyAboutZAxis(additionalTime);
                break;
        }
    }

    function applyAboutXAxis(additionalTime) {
        var i = 0;
        var length = this.particles.length;
        var particle;
        var theta;
        var position = glMatrix.vec3.create();
        for (i = 0; i < length; i++) {
            particle = this.particles[i];
            particle.t = (particle.t + additionalTime) % 1;
            theta = ROTATION * particle.t;
            position[AXES.X] = 0;
            position[AXES.Y] = Math.sin(theta) * this.radius;
            position[AXES.Z] = Math.cos(theta) * this.radius;

            glMatrix.vec3.transformMat4(position, position, this.transform);

            // console.log(position[AXES.X], position[AXES.Y], position[AXES.Z]);

            particle.x = position[AXES.X];
            particle.y = position[AXES.Y];
            particle.z = position[AXES.Z];

            particle.update();
        }
    }

    function applyAboutYAxis(additionalTime) {
        var i = 0;
        var length = this.particles.length;
        var particle;
        var theta;
        var position = [0, 0, 0];
        for (i = 0; i < length; i++) {
            particle = this.particles[i];
            particle.t = (particle.t + additionalTime) % 1;
            theta = ROTATION * particle.t;
            position[AXES.X] = Math.cos(theta) * this.radius;
            position[AXES.Y] = 0;
            position[AXES.Z] = Math.sin(theta) * this.radius;

            glMatrix.vec3.transformMat4(position, position, this.transform);

            // console.log(position[AXES.X], position[AXES.Y], position[AXES.Z]);

            particle.x = position[AXES.X];
            particle.y = position[AXES.Y];
            particle.z = position[AXES.Z];

            particle.update();
        }
    }

    function applyAboutZAxis(additionalTime) {
        var i = 0;
        var length = this.particles.length;
        var particle;
        var theta;
        var position = [0, 0, 0];
        for (i = 0; i < length; i++) {
            particle = this.particles[i];
            particle.t = (particle.t + additionalTime) % 1;
            theta = ROTATION * particle.t;
            position[AXES.X] = Math.cos(theta) * this.radius;
            position[AXES.Y] = Math.sin(theta) * this.radius;
            position[AXES.Z] = 0;

            glMatrix.vec3.transformMat4(position, position, this.transform);

            // console.log(position[AXES.X], position[AXES.Y], position[AXES.Z]);

            particle.x = position[AXES.X];
            particle.y = position[AXES.Y];
            particle.z = position[AXES.Z];

            particle.update();
        }
    }

    PeriodicPath.prototype.reposition = reposition;

    PeriodicPath.prototype.applyAboutXAxis = applyAboutXAxis;
    PeriodicPath.prototype.applyAboutYAxis = applyAboutYAxis;
    PeriodicPath.prototype.applyAboutZAxis = applyAboutZAxis;

    PeriodicPath.prototype.update = update;

    PeriodicPath.AXES = AXES;

    return PeriodicPath;
});