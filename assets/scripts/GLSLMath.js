define(function(require) {
    'use strict';

    function GLSLMath() {}

    function lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    GLSLMath.prototype.lerp = lerp;

    return new GLSLMath();
})