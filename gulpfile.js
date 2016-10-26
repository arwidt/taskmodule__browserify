
var gulp = require('gulp');
var async = require('async');
var tm_browserify = require('./index.js');

gulp.task('default', function() {

    async.series([
        tm_browserify('test/main.js', 'dist/main.min.js'),
        tm_browserify('test/main.js', 'dist/main.js', true),
        tm_browserify('test/main.js', 'dist/mainNoParse.js', false, ['node_modules/jquery/dist/jquery.js'])
    ], function() {
        console.log("DONE");
    });

});
