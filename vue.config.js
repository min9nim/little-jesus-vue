module.exports = {
  configureWebpack: config => {
    
    config.module.rules.push(
      {
        test: /\.pug$/,
        loader: "pug-plain-loader",
      },
      {
        test: /\.styl(us)?$/,
        use: ["vue-style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    );
    config.resolve.extensions.push('.ts', '.tsx')
    // console.log(config.module.rules);
    // console.log(config.resolve.extensions);
  },
};
