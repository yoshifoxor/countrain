const NODE_ENV = process.env.NODE_ENV;
const webpack = require('webpack');

module.exports = {
  entry: `${__dirname}/src/index.js`,
  // target: 'node',
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  mode: NODE_ENV || 'production',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/, // /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/
        options: {
          presets: [
            ['@babel/preset-env', { modules: false }],
            '@babel/preset-react'
          ]
        }
      } /*,
      {
        test: /\.css/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: false
            }
          }
        ]
      }*/
    ]
  },
  /* plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ] */
  devtool: 'source-map'
};
