module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    //pkg: grunt.file.readJSON('package.json'),
    hologram: {
      options: {
        config: 'hologram_config.yml'
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js','**/*.sass','**/*.html'],
        tasks: ['default'],
        options: {
          spawn: false,
          event: ['all'],
          livereload: true
        }
      }
    }
  });

  // Load the plugin that provides the "" task.
  grunt.loadNpmTasks('grunt-hologram');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s).
  grunt.registerTask('default', ['hologram','contrib-watch']);

};
