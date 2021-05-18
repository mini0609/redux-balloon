const gulp = require('gulp');
const shell = require('gulp-shell');
const fs = require('fs');

const rootPath = 'packages/';
// const packagesPathArr = ['packages/redux-balloon/']
const packagesPathArr = fs
  .readdirSync(rootPath)
  .filter(item => item !== '.DS_Store')
  .map(item => `${rootPath + item}/`);
console.log(packagesPathArr);

gulp.task(
  'clean for build',
  shell.task(
    packagesPathArr.map(
      path => `rm -rf ${path}types ${path}es ${path}lib`
    )
  )
);

gulp.task(
  'tsc',
  shell.task(
    packagesPathArr.map(
      path => `npx tsc -p ${path}tsconfig.json --outDir ${path}tsc`
    )
  )
);

gulp.task(
  'remove types for tsc',
  shell.task(
    packagesPathArr.map(path => `rm -rf ${path}tsc/types`)
  )
);

gulp.task(
  'babel for es',
  shell.task(
    packagesPathArr.map(
      path => `npx cross-env BABEL_ENV=esm babel ${path}tsc --out-dir ${path}es`
    )
  )
);

gulp.task(
  'babel for lib',
  shell.task(
    packagesPathArr.map(
      path =>
        `npx cross-env BABEL_ENV=commonjs babel ${path}tsc --out-dir ${path}lib`
    )
  )
);

gulp.task(
  'remove tsc',
  shell.task(packagesPathArr.map(path => `rm -rf ${path}tsc`))
);

const build = gulp.series(
  'clean for build',
  'tsc',
  'remove types for tsc',
  gulp.parallel(
    'babel for es',
    'babel for lib'
    // gulp.series('copy for wepy', 'replaceSagaReference for wepy')
  ),
  'remove tsc'
);

gulp.task('build:watch', done => {
  console.log('====== watching .ts(x) files... =====');

  gulp.watch(packagesPathArr.map(path => `${path}src/**/*.ts`), gulp.parallel('build'));
});

module.exports = {
  build
};

// gulp.task('copy for wepy', shell.task([
//   'cp -r tsc wepy'
// ]));

/*gulp.task('replaceSagaReference for wepy', function () {
  gulp.src('./wepy/sagaImports.js')
    .pipe(
      replace(
        'import * as ReduxSaga from \'redux-saga\';',
        'import * as ReduxSaga from \'redux-saga/dist/redux-saga.umd\';'
      )
    )
    .pipe(
      replace(
        'import * as effects from \'redux-saga/effects\';',
        ''
      )
    )
    .pipe(
      replace(
        'const SagaEffects = effects;',
        'const SagaEffects = ReduxSaga.effects;'
      )
    )
    .pipe(gulp.dest('./wepy'));
});*/

// gulp.task('babel for wepy', shell.task([
//   'npx cross-env BABEL_ENV=wepy babel wepy --out-dir wepy'
// ]));

// "build:umd": "cross-env BABEL_ENV=umd rollup -c && es-check es5 dist/redux-balloon.min.js",
