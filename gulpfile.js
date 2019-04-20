/**
 * @file //TODO_PTV: Update the description
 */

'use strict';

// NodeJS modules

// Our modules

// Third party modules
const fs = require('fs-extra');
const path = require('path');

// Gulp modules
const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const print = require('gulp-print').default;
const changed = require('gulp-changed');

const buildDir = path.resolve(__dirname, './dist');

/**
 * Standard 'clean' function, removes all files in the 'buildDir'
 * @returns {Promise<void>} - Returns a promise that resolves upon completion.
 */
function clean() {
  return fs.remove(buildDir);
}

/**
 * Copies all project files that are not typescript and belong in the 'dist' directory.
 *
 * @returns {*} - Returns a stream.
 */
function copyNonTypescriptFiles() {
  return gulp.src([
    '**/*',
    '!**/*.ts',
    '!{node_modules,node_modules/**}',
    '!{dist,dist/**}',
    '!gulpfile.js',
    '!ts*.json',
    '!package*',
    '!.*'
  ])
    .pipe(changed(buildDir))
    .pipe(print((filepath) => `non-src: ${filepath}`))
    .pipe(gulp.dest(buildDir));
}

/**
 * Compiles typescript files, outputs them to the build directory.
 *
 * @returns {*} A stream
 */
function compileTypescript() {
  return gulp.src(['**/*.ts', '!{node_modules,node_modules/**}'])
    .pipe(tsProject())
    .pipe(changed(buildDir, {hasChanged: changed.compareContents}))
    .pipe(print((filepath) => `ts: ${filepath}`))
    .pipe(gulp.dest(buildDir));
}

/**
 * Watches the typescript files for changes, then recompiles them as needed.
 */
function watchTypescript() {
  gulp.watch(['**/*.ts', '!{node_modules,node_modules/**}'], {delay: 300}, compileTypescript);
}

exports.clean = clean;
exports.build = gulp.parallel(compileTypescript, copyNonTypescriptFiles);
exports.default = gulp.series(clean, exports.build);
exports.watch = gulp.series(exports.build, watchTypescript);
