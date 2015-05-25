define(function(require) {
    'use strict';

    function GLSLMath() {}

    function sign(a) {
        if (a < 0) {
            return -1;
        }

        if (a > 0) {
            return 1;
        }

        return 0;
    }

    function lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    GLSLMath.prototype.sign = sign;
    GLSLMath.prototype.lerp = lerp;

    return new GLSLMath();
})