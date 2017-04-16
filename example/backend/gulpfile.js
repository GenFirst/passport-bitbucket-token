'use strict';

var gulp = require('gulp'),
  nodemon = require('gulp-nodemon');

gulp.task('develop', function () {
  nodemon({
    exec: 'node --debug',
    script: 'server.js',
    ext: 'html js',
    env: {'NODE_ENV': 'development'}
  });
});
