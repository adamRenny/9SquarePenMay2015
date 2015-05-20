define(function(require) {
    'use strict';

    function Magnet(x, y, power) {
        this.x = x;
        this.y = y;
        this.power = -power;
    }

    function applyToParticle(particle) {
        var dx = particle.x - this.x;
        var dy = particle.y - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        particle.vx = (dx / distance) * this.power + particle.vx;
        particle.vy = (dy / distance) * this.power + particle.vy;
    }

    Magnet.prototype.applyToParticle = applyToParticle;

    return Magnet;
});