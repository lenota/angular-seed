var gulp = require('gulp'),
        sass = require('gulp-ruby-sass'),
        autoprefixer = require('gulp-autoprefixer'),
        minifycss = require('gulp-minify-css'),
        jshint = require('gulp-jshint'),
        uglify = require('gulp-uglify'),
        imagemin = require('gulp-imagemin'),
        rename = require('gulp-rename'),
        concat = require('gulp-concat'),
        notify = require('gulp-notify'),
        cache = require('gulp-cache'),
        livereload = require('gulp-livereload'),
        del = require('del'),
        jsfiles = require('./jsfiles'),
        htmlreplace = require('gulp-html-replace');


// Styles
gulp.task('styles', function() {
    return gulp.src(['app/css/**/*.css','app/bower_components/html5-boilerplate/css/**/*.css'])
            //.pipe(sass({style: 'expanded', }))
            //.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', '8ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(gulp.dest('dist/styles'))
            .pipe(rename({suffix: '.min'}))
            .pipe(minifycss())
            .pipe(concat('main.min.css'))
            .pipe(gulp.dest('dist/styles'))
            .pipe(notify({message: 'Styles task complete'}));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(['app/js/**/*.js','app/bower_components/**/*.js'])
            .pipe(jshint('.jshintrc'))
            .pipe(jshint.reporter('default'))
            .pipe(gulp.dest('dist/scripts'))
            .pipe(concat('main.js'))
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('dist/scripts'))
            .pipe(notify({message: 'Scripts task complete'}));
});

// Images
gulp.task('images', function() {
    return gulp.src('app/img/**/*')
            .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
            .pipe(gulp.dest('dist/images'))
            .pipe(notify({message: 'Images task complete'}));
});
// Html

gulp.task('html', function() {
  gulp.src('app/index.html')
    .pipe(htmlreplace({
        'styles': 'styles/main.min.css',
        'scripts': jsfiles.jsfiles("./dist/scripts")
    }))
    .pipe(gulp.dest('dist/'))
     .pipe(notify({message: 'html task complete'}));
});


gulp.task('html-min', function() {
  gulp.src('app/index.html')
    .pipe(htmlreplace({
        'styles': 'styles/main.min.css',
        'scripts': 'scripts/main.min.js'
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist/'))
     .pipe(notify({message: 'html task complete'}));
});

// Clean
gulp.task('clean', function(cb) {
    del(['dist/styles', 'dist/scripts', 'dist/assets/img'], cb)
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'html', 'html-min');
});

// Watch
gulp.task('watch', function() {

// Watch .scss files
    gulp.watch('app/css/**/*.css', ['styles']);

// Watch .js files
    gulp.watch('app/js/**/*.js', ['scripts']);

// Watch image files
    gulp.watch('app/img/**/*', ['images']);

// Create LiveReload server
    livereload.listen();

// Watch any files in dist/, reload on change
    gulp.watch(['dist/**']).on('change', livereload.changed);

});