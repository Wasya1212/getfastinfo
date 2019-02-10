// main modules
const path = require('path');
const Webpack = require('webpack');
const BabelPresetMinify = require('babel-preset-minify');
const merge = require('webpack-merge');
const fs = require('fs');

// plugins
const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// main config
module.exports = merge(require('./common'), {
  entry: {
    bundle: './src/js/index.js',
    styles: [
      './src/sass/index.sass'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '../src/html/index.html'),
      minify: false
    }),
    new MinifyPlugin({
      removeConsole: false
    }, {
      comments: true,
      minify: BabelPresetMinify,
      include: /\.min\.js$/,
    }),
    new Webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: [
      path.join(__dirname, '../dist'),
      path.join(__dirname, '../src/html'),
      path.join(__dirname, '../src/js'),
      path.join(__dirname, '../src/css')
    ],
    compress: false,
    port: 3000,
    index: 'index.html',
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
    historyApiFallback: true,
    inline: true
  }
});
