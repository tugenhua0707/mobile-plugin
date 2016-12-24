var gulp = require('gulp');
var del = require('del');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var revAll = require('gulp-rev-all');
var replaceAssets = require('gulp-replace-assets');
var fs = require('fs');

var rootBuild = './dist';

gulp.task('clean', function(cb) {
  return del([rootBuild], cb);
});

gulp.task('common-js', ['clean'], function() {
  return gulp.src(['node_modules/react/dist/react.min.js', 'node_modules/react/dist/react-with-addons.min.js', 'node_modules/react-dom/dist/react-dom.min.js'])
            .pipe(gulp.dest(rootBuild + '/client/common'));
});
gulp.task('components-js', ['clean'], function() {
  return gulp.src(['components/*.js'])
            .pipe(gulp.dest(rootBuild + '/client/components'));
});
gulp.task('common-img', ['clean'], function() {
  return gulp.src('src/client/app/imgs/**/*')
            .pipe(gulp.dest(rootBuild + '/client/imgs'));
});

// json 模拟数据使用的 
gulp.task('json', ['clean'], function() {
  return gulp.src(['src/client/app/json/**/*'])
          .pipe(gulp.dest(rootBuild + '/client/json'));
});

gulp.task('common-lib', ['clean'], function() {
  return gulp.src(['lib/zepto.js','lib/fastclick.js'])
            .pipe(uglify())
            .pipe(gulp.dest(rootBuild + '/client/common'));
});

gulp.task('copyPublic2Client', ['browser'], function() {
  return gulp.src(['dist/client/**/*'])
            .pipe(revAll.revision({ dontGlobal: ['png', 'jpg'] }))
            .pipe(gulp.dest(rootBuild + '/client/static'))
            .pipe(revAll.manifestFile())
            .pipe(gulp.dest(rootBuild + '/client/static'))
});

gulp.task('copyViews2Client', ['browser', 'copyPublic2Client'], function() {
  var manifest = fs.readFileSync(rootBuild + '/client/static/rev-manifest.json');
  return gulp.src(['src/client/views/**/*.html'])
        .pipe(replaceAssets(JSON.parse(manifest)))
        .pipe(gulp.dest(rootBuild + '/client/views'))
});

var webpack = require('gulp-webpack');
var webpackBrowserConfig = require('./webpack.production.browser.config.js');
gulp.task('browser', ['clean', 'common-js', 'common-img', 'json', 'common-lib','components-js'], function() {
  return gulp.src('./src/client/app/index')
        .pipe(webpack(webpackBrowserConfig))
        .pipe(gulp.dest('dist/client/'));
});

gulp.task('production', ['browser']);
gulp.task('default', ['clean', 'common-js', 'common-img','json', 'common-lib','components-js', 'browser','copyViews2Client']);