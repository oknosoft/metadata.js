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
    'metadata-react/DataField/DataCell': true,
    'metadata-react/DataField/FieldTypeCell': true,
    'metadata-react/DataField/FieldPathCell': true,
    'metadata-react/DataField/FieldPropsCell': true,
    'metadata-external/react-data-grid': true,
    'metadata-external/react-data-grid.min': true,
    'metadata-external/react-data-grid-addons': true,
    'metadata-external/react-data-grid-addons.min': true,
    'metadata-react/App/dialogs': true,
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
    'packages/metadata-react/plugin.min': ['./packages/metadata-react/plugin'],
  },
  output: {
    path: path.resolve('.'),
    filename: '[name].js',
    libraryTarget: 'umd'
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

