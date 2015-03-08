//
// http://24ways.org/2013/grunt-is-not-weird-and-hard/
//
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    connect: {
      test: {
        options: {
          port: 8012,
          hostname: 'localhost'
        }
      },
      example: {
        options: {
          port: 8015,
          hostname: 'localhost',
          keepalive: true,
          open: "http://localhost:8015/example/index.html"
        }
      },
      dev: {
        options: {
          port: 8010,
          host: "localhost",
          keepalive: true,
          open: "http://localhost:8010/test/SpecRunner.html"
        }
      },
      doc: {
        options: {
          port: 8017,
          host: "localhost",
          keepalive: true,
          open: "http://localhost:8017/doc/index.html"
        }
      }
    },
    mocha: {
      test: {
        options: {
          log: true,
          logErrors: true,
          reporter: "Spec",
          run: false,
          timeout: 10000,
          urls: ["http://localhost:8012/test/SpecRunner.html"]
        }
      }
    },
    watch: {
      doc: {
        files: ['src/**/*.js'],
        tasks: ['lint', 'jsdoc:build'],
        options: {
          livereload: true
        }
      },
      build: {
        files: ['src/**/*.js', 'test/**/*.js', '*.js'],
        tasks: ['build'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        options: {
          jshintrc: true,
          reporter: require('jshint-stylish')
        },
        src: ['src/**/*.js', 'test/**/*.js', '*.js']
      }
    },
    concurrent: {
      build: {
        tasks: ['connect:dev', 'watch:build'],
        options: {
          logConcurrentOutput: true
        }
      },
      doc: {
        tasks: ['connect:doc', 'watch:doc'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    browserify: {
      build: {
        files: {
          "dist/bit-imports.js": ["src/bit-imports.js"]
        },
        options: {
          browserifyOptions: {
            "detectGlobals": true,
            "ignoreMissing": true,
            "standalone": "bitimports"
          }
        }
      }
    },
    uglify: {
      build: {
        options: {
          sourceMap: true
        },
        files: {
          "dist/bit-imports.min.js": ["dist/bit-imports.js"]
        }
      }
    },
    jsdoc : {
      build: {
        src: ['src/**/*.js', 'README.md'],
        options: {
          destination: 'doc',
          verbose: true
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        regExp: false
      }
    }
  });

  grunt.loadNpmTasks("grunt-mocha");
  grunt.loadNpmTasks("grunt-jsdoc");
  grunt.loadNpmTasks("grunt-bump");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-browserify");

  grunt.registerTask("build", ["jshint:all", "browserify:build", "uglify:build"]);
  grunt.registerTask("lint", ["jshint:all"]);
  grunt.registerTask("test", ["connect:test", "mocha:test"]);
  grunt.registerTask("example", ["connect:example"]);
  grunt.registerTask("doc", ["concurrent:doc"]);
  grunt.registerTask("dev", ["concurrent:build"]);
};
