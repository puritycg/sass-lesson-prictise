const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();

//***************-> Config <-***************
let config = {
    paths:{
        scss: './src/scss/**/*.scss',
        html: './public/index.html'
    },
    output:{
        cssName: 'bundle.min.css',
        path: './public'
    },
    isDevelop: true
};

//***************-> SASS Task <-***************
gulp.task('scss', function () {
    return gulp.src(config.paths.scss)
        .pipe(gulpIf(config.isDevelop, sourcemaps.init()))
        .pipe(sass({outputStyle: 'expanded'})).on('error', sass.logError)
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer())
        .pipe(gulpIf(config.isDevelop, sourcemaps.write()))
        .pipe(gulpIf(config.isDevelop, cleanCSS()))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
});


//***************-> Serve Task <-***************
gulp.task('serve', function () {
    browserSync.init({
        server:{
            baseDir: config.output.path
        }
    });
    gulp.watch(config.paths.scss, ['scss']);
    gulp.watch(config.paths.html).on('change', browserSync.reload)
});


//***************-> Default Task <-***************
gulp.task('default', ['scss', 'serve']);