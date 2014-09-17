
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-livereload');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-hologram');
  grunt.loadNpmTasks('grunt-open');

  // Configure Grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // grunt-contrib-connect will serve the files of the project
    // on specified port and hostname
    connect: {
      all: {
        options:{
          port: 8000,
          hostname: "0.0.0.0",
          // No need for keepalive anymore as watch will keep Grunt running
          // keepalive: true,
          // Livereload needs connect to insert a Javascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {
            return [
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
              // Serve the project folder
              connect.static(options.base)
            ];
          }
        }
      }
    },
    // grunt-open will open your browser at the project's URL
    open: {
      all: {
        // Gets the port from the connect configuration
        path: 'http://localhost:<%= connect.all.options.port%>'
      }
    },
    compass: {
      dist: {
        options: {
          config: 'config.rb'
        }
      }
    },
    hologram: {
      dist:{
        options: {
          config: 'hologram_config.yml'
        }
      }
    },
    watch: {
      options: {
        livereload: true
      },
      sass: {
        files: ['sass/*.scss'],
        tasks: ['compass:dist','hologram:dist']
      },
      scripts: {
        files: ['*/*.js','*/*.html','index.html']//deeper **/*.js
        //,tasks: ['livereload']
      },
      livereload: {
        files: ['css/*.css'],
        options: { livereload: true }
      }
    }

  });

  // Creates the `server` task
  grunt.registerTask('server',[
    // Starts the livereload server to which the browser will connect to
    // get notified of when it needs to reload
    'connect',
    'open',
    // Starts monitoring the folders and keep Grunt alive
    'compass',
    'hologram',
    'watch'
  ]);
};
