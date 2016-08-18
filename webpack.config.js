const autoprefixer = require('autoprefixer')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
require('babel-polyfill') // for Object.assign and Promise on IE11
require('whatwg-fetch') // fetch polyfill for IE11
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const yargs = require('yargs').argv
const CONFIG = require('./config.js')

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
]

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist')
}

// determine which api endpoint to use
var API_PATH = CONFIG.apiPaths[CONFIG.defaults.apiPaths]
if (yargs.endpoint && CONFIG.apiPaths.hasOwnProperty(yargs.endpoint)) {
  API_PATH = CONFIG.apiPaths[yargs.endpoint]
}

// determine which piwik site to use
var PIWIK_SITE = CONFIG.piwikEnvs[CONFIG.defaults.piwikEnvs]
if (yargs.piwik && CONFIG.piwikEnvs.hasOwnProperty(yargs.piwik)) {
  PIWIK_SITE = CONFIG.piwikEnvs[yargs.piwik]
}

// config that is shared between all types of build
const common = {
  context: PATHS.src,

  entry: {
    javascript: ['whatwg-fetch', 'babel-polyfill', './index.js']
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
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', sassLoaders.join('!'))
      }
    ]
  },

  plugins: [
    new CopyWebpackPlugin(
      [{ from: PATHS.src + '/assets', to: 'assets' }],
      { ignore: ['.gitkeep'] }
    ),
    new ExtractTextPlugin('app.css'),
    new HtmlWebpackPlugin({
      template: 'index.html',
      hash: true
    })
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
var runCommand = process.env.npm_lifecycle_event

// only use the run script invocation command up to the colon delimiter
if (runCommand.indexOf(':') > -1) {
  runCommand = runCommand.substr(0, runCommand.indexOf(':'))
}

switch (runCommand) {
  case 'build':
    config = merge(common, {
      devtool: 'cheap-module-source-map',

      output: {
        path: PATHS.dist
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env': {NODE_ENV: JSON.stringify('production')},
          API_ENDPOINT: JSON.stringify(API_PATH),
          PIWIK_SITE: JSON.stringify(PIWIK_SITE)
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
          'process.env': {NODE_ENV: JSON.stringify('development')},
          API_ENDPOINT: JSON.stringify(API_PATH),
          PIWIK_SITE: JSON.stringify(PIWIK_SITE)
        })
      ]
    })
}

module.exports = config
