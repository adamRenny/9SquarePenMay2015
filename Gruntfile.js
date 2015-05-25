module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-amdclean');

    grunt.initConfig({
        // pkg: grunt.file.readJSON('./package.json'),

        requirejs: {
            options: {
                baseUrl: 'assets/scripts',
                mainConfigFile: 'assets/scripts/config.js',
                useStrict: true,
                optimize: 'uglify2',
                // Minification options
                uglify2: {
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        sequences: false,
                        global_defs: { // jshint ignore:line
                            DEBUG: false
                        }
                    },
                    warnings: false,
                    mangle: true
                }
            },

            compile: {
                options: {
                    findNestedDependencies: true,
                    name: 'main',
                    out: 'assets/scripts/main-cleaned.js'
                }
            }
        },

        amdclean: {
            particles: {
                src: 'assets/scripts/main-cleaned.js'
            }
        }
    });

    grunt.registerTask('default', [
        'requirejs:compile'
        // 'amdclean:particles'
    ]);
};