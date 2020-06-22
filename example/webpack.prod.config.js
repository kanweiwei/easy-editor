const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./index.tsx",
  output: {
    path: path.join(__dirname, "./site"),
    filename: "bundle.js",
  },
  resolve: {
    modules: ["../node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|tsx)$/,
        loader: "babel-loader",
        exclude: [/node_modules/],
        options: {
          babelrc: false,
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "entry",
                corejs: 3,
                targets: {
                  browsers:
                    "last 2 Firefox versions, last 2 Chrome versions, last 2 Edge versions, last 2 Safari versions",
                },
              },
            ],
            ["@babel/preset-react"],
            ["@babel/preset-typescript"],
          ],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-spread",
            "@babel/plugin-proposal-optional-chaining",
            "@babel/plugin-transform-object-assign",
          ],
          compact: true,
          sourceType: "unambiguous",
        },
      },
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader"],
      },
      {
        test: /\.(eot|woff|ttf|svg)$/,
        loader: "url-loader",
      },
    ],
  },
  mode: "production",
  plugins: [],
};
