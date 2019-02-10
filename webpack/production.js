// main modules
const path = require('path');
const BabelPresetMinify = require('babel-preset-minify');
const merge = require('webpack-merge');

// plugins
const MinifyPlugin = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

// clear optimization options
const common = require('./common')
delete common.optimization

// main config
module.exports = merge(common, {
  entry: {
    bundle: './src/js/index.js',
    styles: [
      './src/sass/index.sass'
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.resolve(__dirname, '../src/html/index.html'),
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true
      }
    }),
    new MinifyPlugin({
      removeConsole: false
    }, {
      comments: false,
      minify: BabelPresetMinify,
      include: /\.min\.js$/,
    })
  ]
});
