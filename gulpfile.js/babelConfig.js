module.exports = function (modules) {
  const plugins = [
    "@babel/plugin-transform-object-assign",
    "@babel/plugin-transform-async-to-generator",
    ["@babel/plugin-transform-runtime", { corejs: 3 }],
    "@babel/plugin-transform-regenerator",
  ];
  return {
    presets: [
      require.resolve("@babel/preset-react"),
      [
        require.resolve("@babel/preset-env"),
        {
          modules,
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
    ],
    plugins,
  };
};
