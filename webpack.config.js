const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = (env, options) => {
  const isDevelopment = options.mode === 'development';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },
        {
          test: /\.html$/,
          use: 'html-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: isDevelopment ? '[name].css' : '[name]-[contenthash].css',
        chunkFilename: isDevelopment ? '[id].css' : '[id]-[contenthash].css',
      }),
      new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        watch: true,
      },
      port: 3000,
    },
    resolve: {
      fallback: {
        crypto: false,
      },
    },
  };
};
