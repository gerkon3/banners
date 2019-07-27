var path                   = require('path'),
		gulp                   = require('gulp'),
		browserSync            = require('browser-sync').create(),
		pug                    = require('gulp-pug'),
    sass                   = require('gulp-sass'),
		autoprefixer           = require('gulp-autoprefixer'),
		cleanCSS               = require('gulp-clean-css'),
		babel                  = require('gulp-babel'),
    uglify                 = require('gulp-uglify'),
    pipeline               = require('readable-stream').pipeline,
    imagemin               = require('gulp-imagemin'),
    tinypng                = require('gulp-tinypng-compress'),
    cache                  = require('gulp-cache'),
    del                    = require('del');

gulp.task('pug', function buildHTML() {
	return gulp.src('src/pug/*.pug')
		.pipe(pug({pretty: true}))
		.pipe(gulp.dest('dist'))
		.pipe(browserSync.stream());
});

sass.compiler = require('node-sass');
gulp.task('sass-autoprefixer', function () {
	return gulp.src('src/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
			cascade: true
		}))
		.pipe(cleanCSS({
			level: {2: {restructureRules: true}}
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

gulp.task('uglify', function () {
	return pipeline(
		gulp.src('src/js/*.js'),
		babel({presets: ['@babel/env']}),
		uglify(),
		gulp.dest('dist/js'),
		browserSync.stream()
	);
});

gulp.task('fonts', function() {
	return gulp.src('src/fonts/*{ttf,woff,woff2,svg,eot}')
		.pipe(gulp.dest('dist/fonts'))
});

gulp.task('images1', function() {
	return gulp.src('src/img/*{png,jpg,jpeg}')
		.pipe(tinypng({
			key: 'E5VZkBXIuSvfEHot5rBkLgTjlcWVbwqv',
			sigFile: 'images/.tinypng-sigs',
			log: true
		}))
		.pipe(gulp.dest('dist/img'))
		.pipe(browserSync.stream());
});

gulp.task('images2', function() {
	return gulp.src('src/img/*{svg,gif}')
		.pipe(cache(imagemin([
			imagemin.svgo({
				plugins: [
					{optimizationLevel: 3},
					{progessive: true},
					{interlaced: true},
					{removeViewBox: false},
					{removeUselessStrokeAndFill: false},
					{cleanupIDs: false}
				]
			}),
			imagemin.gifsicle({
				optimizationLevel: 3,
				interlaced: true
			})
		])))
		.pipe(gulp.dest('dist/img'))
		.pipe(browserSync.stream());
});

gulp.task('browser-sync', function(){
	browserSync.init({
		server: {
    	baseDir: "dist"
		},
		notify: false
	});
	gulp.watch('src/sass/**/*.scss', gulp.series('sass-autoprefixer'));
	gulp.watch('src/js/*.js', gulp.series('uglify'));
	gulp.watch('src/pug/**/*.pug', gulp.series('pug'));
	gulp.watch('src/fonts/*', gulp.series('fonts')).on('unlink', function (filepath) {
		var fontsPathFromSrc = path.relative(path.resolve('src/fonts'), filepath);
		var destFontsPath = path.resolve('dist/fonts', fontsPathFromSrc);
		del.sync(destFontsPath);
	});
	gulp.watch('src/img/*', gulp.series('images1', 'images2')).on('unlink', function (filepath) {
		var imgPathFromSrc = path.relative(path.resolve('src/img'), filepath);
		var destImgPath = path.resolve('dist/img', imgPathFromSrc);
		del.sync(destImgPath);
	});
	gulp.watch('dist/*.html').on('change', browserSync.reload);
});

gulp.task('default', gulp.series('pug', 'sass-autoprefixer', 'uglify', 'fonts', 'images1', 'images2', 'browser-sync'));