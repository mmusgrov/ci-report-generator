module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        clean: [
            "dist"
        ],
        jshint: {
            files: ["*.js"]
        },
        execute: {
            target: {
                src: ["index.js"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-execute");

    grunt.registerTask("default", ["clean", "jshint", "execute"]);

};