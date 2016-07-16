const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
]

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist')
}

// config that is shared between all types of build
const common = {
  context: PATHS.src,

  entry: {
    javascript: './index.js',
    html: './index.html'
  },

  output: {
    filename: 'app.js'
    // don't need a path for default config
  },

  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin('app.css')
  ],

  postcss: [
    autoprefixer({
      browsers: ['last 2 versions']
    })
  ],

  // set up resolve so don't have to qualify paths with ./ within src
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    root: [PATHS.src]
  }
}

// build config from common plus custom config according to event trigger
var config

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(common, {
      devtool: 'cheap-module-source-map',

      output: {
        path: PATHS.dist
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env': {NODE_ENV: JSON.stringify('production')}
        }),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            screw_ie8: true // don't try and support IE6->8
          }
        })
      ]
    })
    break
  default:
    config = merge(common, {
      devtool: 'cheap-module-eval-source-map',

      plugins: [
        new webpack.DefinePlugin({
          'process.env': {NODE_ENV: JSON.stringify('development')}
        })
      ]
    })
}

module.exports = config
