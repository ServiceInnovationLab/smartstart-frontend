const autoprefixer = require('autoprefixer')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')
const yargs = require('yargs').argv

const sassLoaders = [
  'css-loader',
  'postcss-loader',
  'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
]

const PATHS = {
  src: path.join(__dirname, './src'),
  dist: path.join(__dirname, './dist')
}

const apiPaths = {
  localTest: '/assets/test-data.json',
  externalTest: 'https://govtnz-test1.cwp.govt.nz/BoacAPI/v1/all',
  externalProd: null
}

// determine which api endpoint to use
var API_PATH = apiPaths.externalTest // TODO update default endpoint to prod when available

if (yargs.endpoint === 'local') {
  API_PATH = apiPaths.localTest
} else if (yargs.endpoint === 'test') {
  API_PATH = apiPaths.externalTest
} else if (yargs.endpoint === 'prod') {
  API_PATH = apiPaths.externalProd
}

// config that is shared between all types of build
const common = {
  context: PATHS.src,

  entry: {
    javascript: './index.js'
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
          API_ENDPOINT: JSON.stringify(API_PATH)
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
          API_ENDPOINT: JSON.stringify(API_PATH)
        })
      ]
    })
}

module.exports = config
