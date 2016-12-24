var path = require('path');
var webpack = require('webpack');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: {
    build: ['./src/client/app/index', hotMiddlewareScript]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.styl'],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    }
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  devtool: '#source-map',
  output: {
    path: path.join(__dirname, 'dist/client/'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src/client/app')
      },
      {
        test: /\.jsx$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src/client/app')
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract(['css', 'stylus'])
      },
      {
        test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'
      },
      {
        loader: 'babel',
        test: /\.js$/,
        query: {
          'plugins': ['lodash'],
          'presets': ['es2015']
        }
      },
      {
        loader: 'babel',
        test: /\.jsx$/,
        query: {
          'plugins': ['lodash'],
          'presets': ['es2015']
        }
      }
    ]
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('dev')
      }
    }),
    new ExtractTextPlugin('index.css', {
      allChunks: true
    })
  ]
};
