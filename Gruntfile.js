module.exports = function (grunt) {

    grunt.initConfig({
        // Import package manifest
        pkg: grunt.file.readJSON("event-playback.jquery.json"),
        // Banner definitions
        meta: {
            banner: "/*\n" +
                    " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
                    " *  <%= pkg.description %>\n" +
                    " *  <%= pkg.homepage %>\n" +
                    " *\n" +
                    " *  Made by <%= pkg.author.name %>\n" +
                    " *  Under <%= pkg.licenses[0].type %> License\n" +
                    " */\n"
        },
        // Concat definitions
        concat: {
            dist: {
                src: ["src/jquery.event-playback.js"],
                dest: "dist/jquery.event-playback.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        // Lint definitions
        jshint: {
            files: ["src/jquery.event-playback.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },
        // Minify definitions
        uglify: {
            my_target: {
                src: ["dist/jquery.event-playback.js"],
                dest: "dist/jquery.event-playback.min.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        },
        // watch for changes to source 
        // Better than calling grunt a million times 
        // (call 'grunt watch')
        watch: {
            files: ['src/*'],
            tasks: ['default']
        }
    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["jshint", "concat", "uglify"]);
    grunt.registerTask("travis", ["jshint"]);
};
