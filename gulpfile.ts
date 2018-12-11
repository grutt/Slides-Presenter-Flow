let gulp = require('gulp');
let ts = require('gulp-typescript');
let exec = require('child_process').exec;
let babelify = require('babelify');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let uglify = require('gulp-uglify');
let sourcemaps = require('gulp-sourcemaps');
let tsify = require('tsify');

gulp.task('ng-build', function(cb) {
    console.log('running ng build...');
    exec('ng build', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
        return true;
    });
});

gulp.task('content-script', function() {
    return browserify({
            basedir: '.',
            debug: true,
            entries: 'src/content-script/boot.ts'
        })
        .transform(babelify.configure({presets: ['es7']}))
        .plugin(tsify)
        .bundle()
        .pipe(source('content-script.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // .pipe(uglify()) TODO replace
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/AngularChromeExtensionBase/'));
});

gulp.task('default', gulp.series('ng-build', 'content-script'));
