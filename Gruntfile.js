module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                stripBanners: true,
                sourceMap: true
            },
            buildjs: {
                src: ['public/js/src/*.js'],
                dest: 'public/js/build/<%= pkg.name %>-<%= pkg.version %>.js'

            },
            buildcss: {
                src: ['public/stylesheets/src/*.css'],
                dest: 'public/stylesheets/build/<%= pkg.name %>-<%= pkg.version %>.css'
            }
        },
        uglify: {
            options : {
                sourceMap : true,
                sourceMapIncludeSources : true,
                sourceMapIn : '<%= concat.buildjs.dest %>.map'
            },
            buildjs: {
                src: '<%= concat.buildjs.dest %>',
                dest: 'public/js/build/<%= pkg.name %>-<%= pkg.version %>.min.js'
            }
        },
        cssmin: {
            options : {
                sourceMap : true,
                sourceMapIncludeSources : true,
                sourceMapIn : '<%= concat.buildcss.dest %>.map'
            },
            buildcss: {
                src: '<%= concat.buildcss.dest %>',
                dest: 'public/stylesheets/build/<%= pkg.name %>-<%= pkg.version %>.min.css'
            }
        },
        processhtml: {
            options: {
                data: {
                    minifiedcss:'<%= pkg.name %>-<%= pkg.version %>.min.css',
                    minifiedjs:'<%= pkg.name %>-<%= pkg.version %>.min.js'
                }
            },
            build: {
                files: {
                    'public/index.html': ['public/index_dev.html']
                }
            }
        },
        clean: {
            build: {
                src: ['public/stylesheets/build/*.css', '!public/stylesheets/build/*.min.css', 'public/js/build/*.js', '!public/js/build/*.min.js','public/stylesheets/build/*.css.map', 'public/js/build/*.js.map','!public/stylesheets/build/*.min.css.map', '!public/js/build/*.min.js.map']
            },
            purge: {
                src: ['public/stylesheets/build/*.css', 'public/js/build/*.js','public/stylesheets/build/*.css.map', 'public/js/build/*.js.map','public/index.html']

            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-processhtml');

    grunt.registerTask('default', ['concat', 'cssmin', 'uglify', 'processhtml', 'clean:build']);

};