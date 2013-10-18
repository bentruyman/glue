/* global module */
module.exports = function (grunt) {
  var javascripts = ["Gruntfile.js", "glue.js", "test/*.js"];

  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    clean: {
      dist: "dist",
      testem: "./json"
    },
    jshint: {
      files: javascripts,
      options: {
        jshintrc: ".jshintrc"
      }
    },
    testem: {
      json: "testem.json"
    },
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"
      },
      dist: {
        files: {
          "dist/<%= pkg.name %>.min.js": "glue.js"
        }
      }
    },
    watch: {
      files: javascripts,
      tasks: ["jshint"],
      options: {
        interrupt: true
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-testem");

  grunt.registerTask("default", ["jshint"]);
  grunt.registerTask("test", ["jshint", "testem", "clean:testem"]);
};
