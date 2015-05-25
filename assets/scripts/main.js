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
    });

});