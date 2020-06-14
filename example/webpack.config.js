const HtmlPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: "./index.tsx",
  output: {
    path: "/site",
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
            ["@babel/preset-env", { useBuiltIns: "usage", corejs: 3 }],
            ["@babel/preset-react"],
            ["@babel/preset-typescript"],
          ],
          plugins: ["@babel/plugin-proposal-class-properties"],
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
  mode: "development",
  plugins: [
    // new HtmlPlugin({
    //   template: "./example/index.html",
    //   filename: "index.html",
    //   inject: true,
    //   hash: true,
    // }),
  ],
  devServer: {
    publicPath: "/site",
  },
};
