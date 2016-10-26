var browserify = require('browserify');
var source_stream = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var gif = require('gulp-if');

module.exports = function(source, output, debug, noParse) {
    return function(callback) {
        debug = debug || false;
        noParse = noParse || [];

        var onError = function (err) {
            gutil.beep();
            gutil.log(err);
            this.emit('end');
        };

        var b = browserify({
            entries: source,
            fast: debug,
            debug: debug,
            noParse: noParse
        });

        var paths = output.split('/');
        var outputName = paths[paths.length-1].split('.').slice(0, -1).join('.');
        var outputPath = paths.slice(0, -1).join('/');

        return b.bundle()
            .on('error', onError)
            .pipe(source_stream(outputName + ".js"))
            .pipe(buffer())
            .pipe(gif(!debug, sourcemaps.init({loadMaps: true})))
            .pipe(gif(!debug, uglify()))
            .on('error', onError)
            .pipe(gif(!debug, sourcemaps.write('./')))
            .pipe(gulp.dest(outputPath))
            .on('finish', function() {
                if (callback) {
                    callback();
                }
            });
    };
}
