const gulp = require('gulp');
const shell = require('gulp-shell');
const fs = require('fs');

const rootPath = 'packages/';
const packagesArr = fs
  .readdirSync(rootPath)
  .filter(item => item !== '.DS_Store');
const reduxBalloonIndex = packagesArr.indexOf('redux-balloon');
packagesArr.splice(reduxBalloonIndex, 1);
packagesArr.unshift('redux-balloon');
console.log(packagesArr);

gulp.task(
  'clean for build',
  shell.task(
    packagesArr.map(path => `rm -rf ${rootPath}${path}/types ${rootPath}${path}/es ${rootPath}${path}/lib`)
  )
);

gulp.task(
  'tsc',
  shell.task(['npx tsc -p tsconfig.json'])
);

gulp.task(
  'remove types for tsc',
  shell.task(packagesArr.map(path => `rm -rf tsc/${path}/src/types`))
);

gulp.task(
  'babel for es',
  shell.task(
    packagesArr.map(
      path => `npx cross-env BABEL_ENV=esm babel tsc/${path}/src --out-dir ${rootPath}${path}/es`
    )
  )
);

gulp.task(
  'babel for lib',
  shell.task(
    packagesArr.map(
      path =>
        `npx cross-env BABEL_ENV=commonjs babel tsc/${path}/src --out-dir ${rootPath}${path}/lib`
    )
  )
);

gulp.task(
  'remove tsc',
  shell.task(['rm -rf tsc'])
);

gulp.task('copy types', function() {
  return new Promise((resolve => {
    packagesArr.forEach(path => {
      gulp.src(`types/${path}/src/**/*`)
        .pipe(gulp.dest(`${rootPath}${path}/types`))
    })
    resolve()
  }))
});

gulp.task(
  'remove types',
  shell.task(['rm -rf types'])
);

const build = gulp.series(
  'clean for build',
  'tsc',
  'remove types for tsc',
  'copy types',
  gulp.parallel(
    'babel for es',
    'babel for lib'
    // gulp.series('copy for wepy', 'replaceSagaReference for wepy')
  ),
  'remove tsc',
  'remove types'
);

gulp.task('build:watch', done => {
  console.log('====== watching .ts(x) files... =====');

  gulp.watch(
    packagesArr.map(path => `${rootPath}${path}/src/**/*.ts`),
    gulp.parallel('build')
  );
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
