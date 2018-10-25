const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const package_data = require('./package.json');
const RELEASE = true;

function getPlugins() {
  var pluginsBase = [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"', 'global': 'window'})
  ];

  if(RELEASE) {
    pluginsBase.push(new webpack.optimize.AggressiveMergingPlugin());
  }
  return pluginsBase;
}

function getExternals() {
  const externals = {
    'react': {
      root: 'React',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom'
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs: 'prop-types',
      commonjs2: 'prop-types',
      amd: 'prop-types'
    },
    'react/addons': 'React',
    'moment': true,
    'moment/locale/ru': true,
    'alasql/dist/alasql.min': true,
    'clipboard/lib/clipboard-action': true,
    'metadata-redux': true,
    'axios': true,
    'debug': true,
    'eventemitter2': true,
    'url-parse': true
  };
  for (const key in package_data.dependencies) {
    if(!externals[key]) {
      externals[key] = true;
    }
  }
  return externals;
}

const config = {
  entry: {
    'packages/metadata-superlogin/index.min': ['./packages/metadata-superlogin/src/superlogin'],
  },
  output: {
    path: path.resolve('.'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: getExternals(),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: getPlugins(),
  optimization: {
    minimizer: [new UglifyJSPlugin({
      uglifyOptions: {
        include: /\.min\.js$/,
        compress: { warnings: false, }
      }
    })]
  },
};


module.exports = config;

