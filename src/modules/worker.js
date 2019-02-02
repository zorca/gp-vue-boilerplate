module.exports = function () {
  this.extendBuild(config => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: [
        {
          loader: 'worker-loader',
          options: { inline: false, name: '[name].[hash:5].js' }
        }
      ]
    });
  });
};
