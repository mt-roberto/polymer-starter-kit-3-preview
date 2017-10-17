require('../utils/requires.js');

/* globals gulp */
/* globals config */
/* globals modified */
/* globals runSequence */
/* globals autoprefixer */
/* globals sass */
/* globals rename */
/* globals tap */
/* globals path */

const AUTOPREFIXER_BROWSERS = config.autoprefixer;

const ELEMENTS_SASS = config.path.srcElements + '/**/*.scss';

const YEAR = new Date().getFullYear();

const COPYRIGHT = '/*\n' +
                  '@license\n' +
                  'Copyright (c) {{year}} The Polymer Project Authors. All ' +
                  'rights reserved.\n' +
                  'This code may only be used under the BSD style license ' +
                  'found at http://polymer.github.io/LICENSE.txt\n' +
                  'The complete set of authors may be found at http://' +
                  'polymer.github.io/AUTHORS.txt\n' +
                  'The complete set of contributors may be found at http://' +
                  'polymer.github.io/CONTRIBUTORS.txt\n' +
                  'Code distributed by Google as part of the polymer ' +
                  'project is also\n' +
                  'subject to an additional IP rights grant found at ' +
                  'http://polymer.github.io/PATENTS.txt\n' +
                  '*/\n\n'

const PREFIX = '/* DO NOT EDIT - this file is generated by a script */\n';;

const bundleSass = (file) => {
  let content = file.contents.toString();
  let filename = file.path;
  const regexStyleId = new RegExp('{{style-id}}', 'gi');
  const regexYear = new RegExp('{{year}}', 'gi');

  filename = path.win32.basename(filename, '.html');

  content = COPYRIGHT + PREFIX + content;
  content = content.replace(regexStyleId, filename);
  content = content.replace(regexYear, YEAR);

  return content;
}

// All sass tasks - development
gulp.task('sass:elements', (callback) => {

  return gulp.src(ELEMENTS_SASS)
             .pipe(modified('sass:elements'))
             .pipe(sass())
             .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
             .pipe(rename({
                extname: '.css'
              }))
             .pipe(tap((file) => {
               file.contents = new Buffer(bundleSass(file));
             }))
             .pipe(gulp.dest(config.path.srcElements));
});
