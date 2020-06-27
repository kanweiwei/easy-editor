const path = require("path");
const gulp = require("gulp");
const rimraf = require("rimraf");
const ts = require("gulp-typescript");
const less = require("gulp-less");
const through2 = require("through2");
const merge2 = require("merge2");
const tsConfig = require("./tsconfig")();
const replaceLib = require("./replaceLib");
const babel = require("gulp-babel");
const getBabelCommonConfig = require("./babelConfig");
const tsDefaultReporter = ts.reporter.defaultReporter();
const base64 = require("gulp-base64");

const cwd = process.cwd();

const stripCode = require("gulp-strip-code");

function compileTs(stream) {
  return stream.pipe(ts(tsConfig)).js.pipe(
    through2.obj(function (file, encoding, next) {
      file.path = file.path.replace(/\.[jt]sx$/, ".js");
      this.push(file);
      next();
    })
  );
}

function clean(cb) {
  rimraf.sync(path.join(cwd, "build"));
  cb();
}

function tsc() {
  let source = [
    `src/**/*.ts`,
    `src/**/*.js`,
    `src/**/*.tsx`,
    "!node_modules/**/*.*",
    "typings/**/*.d.ts",
  ];
  return merge2(
    compileTs(gulp.src(source))
      .pipe(
        through2.obj(function (file, encoding, next) {
          let fileContent = file.contents.toString();
          file.contents = Buffer.from(
            fileContent.replace(/(\.less)(['"]{1}\;?)$/gm, ".css$2"),
            "utf-8"
          );
          this.push(file);
          next();
        })
      )
      .pipe(gulp.dest(`build/dist`))
  );
}

function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules);
  delete babelConfig.cacheDirectory;
  if (modules === false) {
    babelConfig.plugins.push(replaceLib);
  } else {
    babelConfig.plugins.push("@babel/plugin-transform-modules-commonjs");
  }
  let stream = js.pipe(babel(babelConfig));
  if (modules === false) {
    stream = stream.pipe(
      stripCode({
        start_comment: "@remove-on-es-build-begin",
        end_comment: "@remove-on-es-build-end",
      })
    );
  }
  return stream
    .pipe(
      through2.obj(function (file, encoding, next) {
        let fileContent = file.contents.toString();
        file.contents = Buffer.from(
          fileContent.replace(/(\.less)(['"]{1}\;?)$/gm, ".css$2"),
          "utf-8"
        );
        this.push(file);
        next();
      })
    )
    .pipe(gulp.dest(modules === false ? `build/es` : `build/lib`));
}

function compile(modules) {
  let error = 0;

  function check() {
    if (error && !process.argv["ignore-error"]) {
      process.exit(1);
    }
  }

  let source = [
    `src/**/*.ts`,
    `src/**/*.js`,
    `src/**/*.tsx`,
    "!node_modules/**/*.*",
    "typings/**/*.d.ts",
  ];
  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = 1;
      },
      finish: tsDefaultReporter.finish,
    })
  );

  tsResult.on("finish", check);
  tsResult.on("end", check);
  return merge2([
    babelify(tsResult.js, modules),
    tsResult.dts.pipe(gulp.dest(modules === false ? `build/es` : `build/lib`)),
  ]);
}

function compileWithEs() {
  return compile(false);
}

function compileLess() {
  return gulp
    .src(["src/**/*.less"])
    .pipe(
      less({
        paths: [path.join(cwd, "src")],
      })
    )
    .pipe(base64())
    .pipe(gulp.dest(`build/es`))
    .pipe(gulp.dest(`build/dist`));
}

function copyAssets() {
  return gulp
    .src("src/assets/font/*.*", { base: "src" })
    .pipe(gulp.dest("build/es"))
    .pipe(gulp.dest("build/dist"));
}

exports.copyAssets = copyAssets;

exports.clean = clean;

exports.tsc = gulp.series(clean, tsc);

exports.compileWithEs = gulp.series(
  clean,
  tsc,
  copyAssets,
  compileLess,
  compileWithEs
);

function copyPackageFile() {
  return gulp.src(["./package.json", "README.md"]).pipe(gulp.dest("build"));
}

exports.compile = gulp.series(
  clean,
  copyPackageFile,
  copyAssets,
  compileLess,
  compileWithEs
);

exports.watch = () => {
  return gulp.watch(
    ["src/**/*.tsx", "src/**/*.less", "src/**/*.ts"],
    gulp.series(clean, copyPackageFile, copyAssets, compileLess, compileWithEs)
  );
};
