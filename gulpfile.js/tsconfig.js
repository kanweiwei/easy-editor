"use strict";

const fs = require("fs");
const path = require("path");

module.exports = function () {
  let my = {};
  if (fs.existsSync(path.join(process.cwd(), "tsconfig.json"))) {
    my = require(path.join(process.cwd(), "tsconfig.json"));
  }
  return Object.assign(my.compilerOptions, {
    noUnusedParameters: false,
    noUnusedLocals: true,
    strictNullChecks: true,
    target: "es5",
    jsx: "preserve",
    moduleResolution: "node",
    declaration: true,
    allowSyntheticDefaultImports: true,
    // isolatedModules: true,
  });
};
