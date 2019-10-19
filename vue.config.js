module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: "pug-plain-loader",
        },
        {
          test: /\.styl(us)?$/,
          use: ["vue-style-loader", "css-loader", "stylus-loader"],
        },
      ],
    },
  },
};
