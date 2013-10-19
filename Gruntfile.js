module.exports = function (grunt) {
  var javascripts = ["Gruntfile.js", "glue.js", "test/*.js"],
      pkg = grunt.file.readJSON("package.json");

  grunt.initConfig({
    bytesize: {
      src: ["dist/glue.js", "dist/glue.min.js"]
    },
    clean: {
      testem: ["./json", "./testem.*.json"]
    },
    copy: {
      dist: {
        src: ["glue.js"],
        dest: "dist/"
      }
    },
    jshint: {
      files: javascripts,
      options: {
        jshintrc: ".jshintrc"
      }
    },
    replace: {
      dist: {
        options: {
          patterns: [
            { match: "version", replacement: pkg.version },
            { match: "author", replacement: pkg.author }
          ]
        },
        src: ["glue.js"],
        dest: "dist/"
      }
    },
    testem: {
      json: "testem.json"
    },
    uglify: {
      dist: {
        options: {
          preserveComments: "some",
          report: "gzip"
        },
        files: {
          "dist/glue.min.js": "dist/glue.js"
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
  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-testem");

  grunt.registerTask("default", ["jshint"]);
  grunt.registerTask("dist", ["replace:dist", "uglify"]);
  grunt.registerTask("test", ["jshint", "testem", "clean:testem"]);
};
