const path = require('path');
const increaseSpecificity = require('postcss-increase-specificity');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'production',
  entry: './src/EmbeddableChat.tsx',
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.join(__dirname, 'lib'),
    library: 'EmbeddableChat',
    libraryExport: 'default',
    libraryTarget: 'window'
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.REACT_APP_DIALOGFLOW_ACCESS_TOKEN': JSON.stringify(''),
    })
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/'
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          // fallback to style-loader in development
          // devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader',
          'cssimportant-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                increaseSpecificity({
                  stackableRoot: '.AppHolder',
                  repeat: 1,
                }),
              ],
              sourceMap: devMode,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, '../../node_modules'), 'node_modules'],
    extensions: ['*','.ts', '.tsx', '.js', '.json', '.png']
  },
  target: "node"
};
