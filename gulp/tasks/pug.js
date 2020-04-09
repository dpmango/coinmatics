import gulp from 'gulp';
import pug from 'gulp-pug';
import util from 'gulp-util';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import gulpif from 'gulp-if';
import frontMatter from 'gulp-front-matter';
import prettify from 'gulp-prettify';
import config from '../config';

const renderHtml = onlyChanged =>
  gulp
    .src([config.src.templates + '/[^_]*.pug'])
    .pipe(plumber({ errorHandler: config.errorHandler }))
    .pipe(gulpif(onlyChanged, changed(config.dest.html, { extension: '.html' })))
    .pipe(frontMatter({ property: 'data' }))
    .pipe(pug())
    .pipe(
      config.production
        ? prettify({
            indent_size: 2,
            wrap_attributes: 'auto', // 'force'
            preserve_newlines: true,
            // unformatted: [],
            end_with_newline: true,
          })
        : util.noop()
    )
    .pipe(gulp.dest(config.dest.html));

const buildPug = () => renderHtml();
const watch = () => () => {
  gulp.watch([config.src.templates + '/**/[^_]*.pug'], buildPug);

  gulp.watch([config.src.templates + '/**/_*.pug', config.src.components + '/**/*.pug'], buildPug);
};

module.exports.build = buildPug;
module.exports.watch = watch;
