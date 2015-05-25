define(function(require) {
    'use strict';

    var CONSTANTS = require('./Constants');
    var ParticleSystem = require('./ParticleSystem');
    var TimelineLite = require('TimelineLite');

    var MILLISECONDS_PER_SECOND = 1000;
    var THRESHOLD = (MILLISECONDS_PER_SECOND/60) * 15;

    var Power1 = window.Power1;

    function Visual() {
        this.shouldStop = false;

        this.build();
    }

    function build() {
        this.system = new ParticleSystem();
        this.timeline = new TimelineLite();
        this.timeline
            .from(this.system, 0, {})
            .to(this.system, 1.4, {
                scale: 0.10,
                rotationY: 7 * Math.PI,
                rotationZ: Math.PI / 4,
                ease: Power4.easeInOut
            })
            .to(this.system, 0.2, {
                scale: 0.25,
                rotationX: 0,
                rotationY: 6 * Math.PI * (18 / 16),
                rotationZ: Math.PI / 8,
                ease: Quart.easeOut
            })
            .to(this.system, 1, {
                scale: 0.96,
                rotationX: 0,
                rotationY: 4 * Math.PI,
                rotationZ: 0,
                ease: Power4.easeOut
            }, '+= 0.05')
            .to(this.system, .35, {
                scale: 1,
                rotationX: 0,
                rotationY: 4 * Math.PI,
                rotationZ: 0,
                ease: Linear.easeInOut
            });
    }

    function run() {
        var lastTimestamp = (new Date()).getTime();
        var visual = this;
        var timeline = this.timeline;

        var system = this.system;

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

            if (!timeline._active) {
                system.rotationX = 0;
                system.rotationY = 0;
                system.rotationZ = 0;
                timeline.restart();
            }

            var elapsedTimestampInSeconds = elapsedTimestamp / MILLISECONDS_PER_SECOND;

            system.step(elapsedTimestampInSeconds);
        }

        step();
    }

    Visual.prototype.build = build;
    Visual.prototype.run = run;

    return Visual;
});