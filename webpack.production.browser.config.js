var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: {
    build: ['./src/client/app/index']
  },
  output: {
    path: path.join(__dirname, 'dist/client/'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.styl'],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      output: {
        comments: false  // remove all comments
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('index.css', {
      allChunks: true
    })
  ],
  module: {
    loaders: [
      {
        test: require.resolve('./node_modules/react'),
        loader: 'expose?React'
      },
      {
        test: require.resolve('./node_modules/react-dom'),
        loader: 'expose?ReactDOM'
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src/client/app')
      },
      {
        test: /\.jsx$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src/client/app')
      },
      {
        'loader': 'babel',
        'test': /\.js$/,
        'query': {
          'plugins': ['lodash'],
          'presets': ['es2015']
        }
      },
      {
        'loader': 'babel',
        'test': /\.jsx$/,
        'query': {
          'plugins': ['lodash'],
          'presets': ['es2015']
        }
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(['css', 'stylus'])
      },
      {
        test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'
      }]
  }
};