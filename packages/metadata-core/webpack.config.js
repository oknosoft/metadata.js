const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const package_data = require('./package.json');
const RELEASE = true;

function getPlugins() {
  var pluginsBase =  [
    new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"', 'global': 'window'})
  ];

  if (RELEASE) {
    pluginsBase.push(new webpack.optimize.AggressiveMergingPlugin());
  }
  return pluginsBase;
}

const config = {
  entry: {
    'packages/metadata-core/index.min': ['./packages/metadata-core/src'],
    'packages/metadata-core/lib/mime.min': ['./packages/metadata-core/src/mime'],
  },
  output: {
    path: path.resolve('.'),
    filename: '[name].js',
    //library: ['MetaEngine'],
    libraryTarget: 'umd'
  },
  externals: {
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
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          // options: {
          //   presets: ['env']
          // }
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

