// main modules
const path = require('path');

// main config
module.exports = {
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.sass/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
            }
          },
          'extract-loader',
          'css-loader?-url',
          'postcss-loader',
          'sass-loader'
        ]
      },
      // {
      //   test: /\.(m?js)(\.(sa|sc|c)ss)?$/,
      //   exclude: /(node_modules|bower_components)/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       // presets: ['env', 'es2017', 'es2015', 'stage-3', 'react'],
      //       presets: ["@babel/preset-env"],
      //       // plugins: ['@babel/plugin-transform-runtime', '@babel/preset-env', '@babel/react']
      //     }
      //   }
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name][hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 70
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name][hash].[ext]'
          }
        },
      }
    ]
  },
  resolve: {
    extensions: [ '.js', '.mjs']
  },
  optimization: {
    minimize: false
  }
};
