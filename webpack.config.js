/* globals API_PATH:true, PIWIK_SITE:true */

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

const piwikInstance = 'https://analytics.smartstart.services.govt.nz/piwik.php'

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
if (yargs.endpoint) {
  API_PATH = yargs.endpoint
} else {
  throw new Error('API endpoint not specified')
}

// determine which piwik site to use
if (yargs.piwik) {
  PIWIK_SITE = yargs.piwik
} else {
  throw new Error('Piwik site ID not specified')
}

// config that is shared between all types of build
const common = {
  context: PATHS.src,

  entry: {
    javascript: ['whatwg-fetch', 'babel-polyfill', './index.js']
  },

  devServer: {
    historyApiFallback: true
  },

  output: {
    filename: 'app.js',
    publicPath: '/'
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
      [
        { from: PATHS.src + '/assets', to: 'assets' },
        { from: PATHS.src + '/assets/favicons/browserconfig.xml', to: 'browserconfig.xml' },
        { from: PATHS.src + '/static-pages', to: 'static-pages' },
        { from: PATHS.src + '/static-pages/static-page.css', to: 'static-page.css' }
      ],
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
var frontendHost = process.env.frontend_host || 'http://localhost:8080';

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
          PIWIK_SITE: JSON.stringify(PIWIK_SITE),
          PIWIK_INSTANCE: JSON.stringify(piwikInstance)
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
            screw_ie8: true // don't try and support IE6->8
          }
        }),
        new webpack.optimize.OccurrenceOrderPlugin() // in combo with uglify this is equivalent to -p
      ]
    })
    break
  default:
    config = merge.strategy({
      entry: 'replace',
      devServer: 'replace',
      plugins: 'preprend',
      'module.loaders': 'replace'
    })(common, {
      devtool: 'cheap-module-eval-source-map',

      entry: [
        'babel-polyfill',
        `webpack-dev-server/client?${frontendHost}`,
        'webpack/hot/dev-server',
        'react-hot-loader/patch',
        'whatwg-fetch',
        './index.js'
      ],

      devServer: {
        historyApiFallback: true,
        public: '0.0.0.0',
        host: '0.0.0.0',
        disableHostCheck: true,
        hot: true
      },

      plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // enable HMR globally

        new webpack.NamedModulesPlugin(),
        // prints more readable module names in the browser console on HMR updates

        new webpack.DefinePlugin({
          'process.env': {NODE_ENV: JSON.stringify('development')},
          API_ENDPOINT: JSON.stringify(API_PATH),
          PIWIK_SITE: JSON.stringify(PIWIK_SITE),
          PIWIK_INSTANCE: JSON.stringify(piwikInstance)
        })
      ],

      module: {
        loaders: [
          {
            test: /\.js[x]?$/,
            exclude: /node_modules/,
            loaders: ['react-hot-loader/webpack', 'babel-loader']
          },
          {
            test: /\.scss$/,
            loader: [
              'style-loader',
              'css-loader',
              'postcss-loader',
              'sass-loader?includePaths[]=' + path.resolve(__dirname, './src')
            ].join('!')
          }
        ]
      }
    })
}

module.exports = config
