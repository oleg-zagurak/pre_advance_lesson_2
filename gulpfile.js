const { src, dest, parallel, series, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const imagemin = require('gulp-imagemin');
const del = require('del');

const html = () => {
    return src('app/pages/*.pug')
    .pipe(pug({ pretty: true }))
    .pipe(dest('dist'))
};

const styles = () => {
    return src('app/scss/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('err', sass.logError))
    .pipe(autoprefixer({add: true}))
    .pipe(rename( { suffix: '.min' } ))
    .pipe(dest('dist/css'))
};

const fonts = () => {
    return src('app/fonts/**/*.*')
    .pipe(dest('dist/fonts'))
};

const images = () => {
    return src('app/images/**/*.*')
        .pipe(imagemin())
        .pipe(dest('dist/images'))
};

const watching = () => {
    watch(['app/pages/*.pug'], html);
    watch(['app/scss/**/*.scss'], styles);
    watch(['app/fonts/**/*.*'], fonts);
    watch(['app/images/**/*.*'], images)
};

const server = () => {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        notify: false
    });
    browserSync.watch('dist', browserSync.reload)
};

const deleteDist = (cb) => {
    return del('dist/**/*.*').then(() => { cb() })
};

exports.default = series(
    deleteDist,
    parallel(html, styles, fonts, images),
    parallel(watching, server)
)