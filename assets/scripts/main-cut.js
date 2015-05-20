requirejs.config({
    baseUrl: 'assets/scripts',

    paths: {
        snap: 'vendor/snap.svg/dist/snap.svg',
        docReady: 'vendor/doc-ready/doc-ready',
        eventie: 'vendor/eventie',
        bluebird: 'vendor/bluebird/js/browser/bluebird'
    }
});

require([
    'docReady',
    'snap',
    'GLSLMath',
    'bluebird'
], function(
    docReady,
    Snap,
    GLSLMath,
    Promise
) {
    'use strict';

    var stage;

    var scenes = {
        slice: {
            top: null,
            bottom: null,
            border: null,
            cutPoint: null,
        },

        shutter: {

        }
    };

    var DIMENSIONS = {
        WIDTH: 250,
        HEIGHT: 250,
        SIZE: 250
    };

    var COLORS = {
        BLUE: '#2A3443',
        GREEN: '#569480',
        YELLOW: '#F7DA4B',
        RED: '#C55841',
        WHITE: '#FFFFFF'
    };

    function animate(item, options, duration, easing) {
        function promiseClosure(resolve) {
            item.animate(options, duration, easing, resolve);
        }

        return new Promise(promiseClosure);
    }

    function wait(duration) {
        function promiseWait(resolve) {
            setTimeout(resolve, duration);
        }

        return new Promise(promiseWait);
    }

    docReady(function() {
        stage = Snap(250, 250);
        stage.prependTo(document.getElementById('place'));
        
        // buildSliceScene();
        // animateSliceScene();

        buildShutterScene();
    });

    function buildSliceScene() {
        var scene = scenes.slice;
        scene.top = stage.polygon([
            0, 0,
            0, DIMENSIONS.SIZE,
            DIMENSIONS.SIZE, 0,
            0, 0
        ]);
        scene.top.attr({
            fill: COLORS.GREEN,
            stroke: COLORS.GREEN,
            strokeWidth: 1
        });

        var topMatrix = new Snap.Matrix();
        topMatrix.scale(2, 2, DIMENSIONS.SIZE * 0.5, DIMENSIONS.SIZE * 0.5);
        scene.top.transform(topMatrix);

        scene.bottom = stage.polygon([
            DIMENSIONS.SIZE, DIMENSIONS.SIZE,
            0, DIMENSIONS.SIZE,
            DIMENSIONS.SIZE, 0,
            DIMENSIONS.SIZE, DIMENSIONS.SIZE
        ]);
        scene.bottom.attr({
            fill: COLORS.GREEN,
            stroke: COLORS.GREEN,
            strokeWidth: 1
        });

        var bottomMatrix = new Snap.Matrix();
        bottomMatrix.scale(2, 2, DIMENSIONS.SIZE * 0.5, DIMENSIONS.SIZE * 0.5);
        scene.bottom.transform(bottomMatrix);

        var lineWidth = 5;

        scene.border = stage.line(
            0, DIMENSIONS.SIZE + 0,
            0, DIMENSIONS.SIZE + 0
        );
        scene.border.attr({
            stroke: COLORS.WHITE,
            strokeWidth: lineWidth
        });

        var cutRatio = 90/64;
        var bladeWidth = lineWidth;
        var kissakiLength = Math.round(cutRatio * bladeWidth);
        scene.cutPoint = stage.polygon([
            0, 0,
            bladeWidth, 0,
            bladeWidth * 0.5, kissakiLength,
            0, 0
        ]);
        scene.cutPoint.attr({
            fill: COLORS.WHITE
        });

        var position = new Snap.Matrix();
        position.translate(0 - bladeWidth * 0.5, DIMENSIONS.SIZE);
        position.rotate(-135, bladeWidth * 0.5, 0);
        scene.cutPoint.transform(position);
    }

    function animateSliceScene() {
        var scene = scenes.slice;
        var duration = 510;

        var cutPosition = new Snap.Matrix();
        cutPosition.translate(DIMENSIONS.SIZE - 2.5, 0);
        cutPosition.rotate(-135, 2.5, 0);

        return Promise.all([
                animate(
                    scene.border,
                    {
                        x2: DIMENSIONS.SIZE,
                        y2: 0
                    },
                    duration,
                    mina.easeinout
                ),

                animate(
                    scene.cutPoint,
                    {
                        transform: cutPosition
                    },
                    duration,
                    mina.easeinout
                )
            ])
            .then(function() {
                return wait(33);
            })
            .then(function() {
                scene.cutPoint.remove();
                scene.border.remove();

                var quarterSize = DIMENSIONS.SIZE * 0.25;
                var topCenter = DIMENSIONS.SIZE * 0.25;
                var bottomCenter = DIMENSIONS.SIZE * 0.75;

                var topPosition = new Snap.Matrix();
                var halfSize = DIMENSIONS.SIZE * 0.5;
                var bottomPosition = new Snap.Matrix();
                
                topPosition.translate(-DIMENSIONS.SIZE * 0.75, quarterSize);
                topPosition.rotate(-45, topCenter, topCenter);
                topPosition.scale(2, 2, halfSize, halfSize);

                bottomPosition.translate(DIMENSIONS.SIZE * 0.75, -quarterSize);
                bottomPosition.rotate(-45, bottomCenter, bottomCenter);
                bottomPosition.scale(2, 2, halfSize, halfSize);

                scene.top.attr({
                    strokeWidth: 0
                });

                scene.bottom.attr({
                    strokeWidth: 0
                });

                return Promise.all([
                        animate(
                            scene.top,
                            {
                                transform: topPosition
                            },
                            duration,
                            mina.easeinout
                        ),

                        animate(
                            scene.bottom,
                            {
                                transform: bottomPosition
                            },
                            duration,
                            mina.easeinout
                        )
                    ]);
            });
    }

    function buildShutterBlade(start, end, edgeAngle) {
        
    }

    function buildShutterScene() {
        var points = [];
        var numberOfSides = 5;
        var fullCircle = Math.PI * 2;
        var stepSize = fullCircle / numberOfSides;
        var diameter = 1;
        for (var i = 0; i < numberOfSides; i++) {
            points.push.apply(
                points,
                [
                    diameter * Math.cos(stepSize * i),
                    diameter * Math.sin(stepSize * i)
                ]
            );
        }
        var center = stage.polygon(points);
        var transform = new Snap.Matrix();
        transform.translate(DIMENSIONS.SIZE * 0.5, DIMENSIONS.SIZE * 0.5);
        center.transform(transform);
        center.attr({
            fill: COLORS.BLUE
        });
    }

    function animateShutterScene() {

    }
});