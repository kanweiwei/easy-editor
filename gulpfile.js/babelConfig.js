module.exports = function (modules) {
  const plugins = [
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-transform-async-to-generator",
    ["@babel/plugin-transform-runtime", { corejs: 3 }],
    "@babel/plugin-transform-regenerator",
  ];
  return {
    presets: [
      "@babel/preset-react",
      [
        "@babel/preset-env",
        {
          modules: false,
          targets: {
            browsers: [
              "last 2 versions",
              "Firefox ESR",
              "> 1%",
              "ie >= 9",
              "iOS >= 8",
              "Android >= 4",
            ],
          },
        },
      ],
      "@babel/preset-typescript",
    ],
    plugins,
  };
};
