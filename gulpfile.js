// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');

// Lint Task
gulp.task('lint', function() {
	return gulp.src([
			'src/*.js',
		])
		.pipe(jshint({ devel: true }))
		.pipe(jshint.reporter('default'));
});

// Concatenate & Minify THREE JS
gulp.task('dist', function() {
	return gulp.src([
			'src/threejs-core.service.js',
			'src/threejs-plugins.service.js',
			// 'src/threejs-image-loader.service.js'
		])
		.pipe(concat('angular-tadkit.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('angular-tadkit.min.js'))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch([
		'src/*.js',
	], [
		'lint',
		'dist',
	]);
});

// Default Task
gulp.task('default', [
	'lint',
	'dist',
	'watch'
]);