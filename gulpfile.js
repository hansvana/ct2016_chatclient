const gulp = require('gulp');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('es6', () => {
    var bundler = browserify('./src/script.es6',{debug:true})
        .transform(babelify, {presets: ['es2015']})
        .bundle();

    return bundler
        .pipe(source('script.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch('./src/**/*.*', ['es6']);
});

gulp.task('default', ['watch','es6']);

