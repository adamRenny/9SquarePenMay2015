requirejs.config({
    baseUrl: 'assets/scripts',

    paths: {
        snap: 'vendor/snap.svg/dist/snap.svg',
        docReady: 'vendor/doc-ready/doc-ready',
        eventie: 'vendor/eventie',
        bluebird: 'vendor/bluebird/js/browser/bluebird',
        glMatrix: 'vendor/gl-matrix/dist/gl-matrix'
    }
});

require([
    'docReady',
    'app/Visual'
], function(
    docReady,
    Visual
) {
    'use strict';

    docReady(function() {
        var visual = new Visual();
        visual.run();
        window.v = visual;
    });

});