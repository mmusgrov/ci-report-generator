module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: [
            "dist"
        ],
        jshint: {
            all: ["*.js", "generators/*.js", "streams/*.js"]
        },
        mkdir: {
            all: {
                options: {
                    create: ["dist"]
                }
            }
        },
        execute: {
            target: {
                src: ["index.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mkdir");
    grunt.loadNpmTasks("grunt-execute");

    grunt.registerTask("default", ["clean", "jshint", "mkdir", "execute"]);

};