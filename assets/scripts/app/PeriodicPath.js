define(function(require) {
    'use strict';

    var CONSTANTS = require('./Constants');
    var stage = require('./Stage');
    var Snap = require('snap');
    var glMatrix = require('glMatrix');
    var mat4 = glMatrix.mat4;
    var vec3 = glMatrix.vec3;

    var AXES = {
        X: 0,
        Y: 1,
        Z: 2
    };

    var ROTATION = Math.PI * 2;
    var vector = [];

    function PeriodicPath(radius, centerX, centerY, centerZ, rotationsPerSecond, axis) {
        this.radius = radius;
        this.particles = [];
        this.rotationsPerSecond = rotationsPerSecond;
        this.axis = axis;

        this.baseTransform = mat4.create();

        this.centerX = centerX;
        this.centerY = centerY;
        this.centerZ = centerZ;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;

        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.transform = mat4.create();
    }

    function updateTransform() {
        vector[AXES.X] = this.centerX;
        vector[AXES.Y] = this.centerY;
        vector[AXES.Z] = this.centerZ;

        mat4.copy(this.transform, this.baseTransform);
        mat4.translate(
            this.transform,
            this.transform,
            vector
        );

        vector[AXES.X] = this.scaleX;
        vector[AXES.Y] = this.scaleY;
        vector[AXES.Z] = this.scaleZ;

        mat4.scale(
            this.transform,
            this.transform,
            vector
        );

        mat4.rotateX(this.transform, this.transform, this.rotationX);
        mat4.rotateY(this.transform, this.transform, this.rotationY);
        mat4.rotateZ(this.transform, this.transform, this.rotationZ);
    }

    function update(elapsed) {
        this.updateTransform();

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

            vec3.transformMat4(position, position, this.transform);

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

            vec3.transformMat4(position, position, this.transform);

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

            vec3.transformMat4(position, position, this.transform);

            particle.x = position[AXES.X];
            particle.y = position[AXES.Y];
            particle.z = position[AXES.Z];

            particle.update();
        }
    }

    PeriodicPath.prototype.updateTransform = updateTransform;

    PeriodicPath.prototype.applyAboutXAxis = applyAboutXAxis;
    PeriodicPath.prototype.applyAboutYAxis = applyAboutYAxis;
    PeriodicPath.prototype.applyAboutZAxis = applyAboutZAxis;

    PeriodicPath.prototype.update = update;

    PeriodicPath.AXES = AXES;

    return PeriodicPath;
});