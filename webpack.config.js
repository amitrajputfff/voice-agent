const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';
  
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? 'voice-widget.dev.js' : 'voice-widget.min.js',
      library: 'LiaPlusVoice',
      libraryTarget: 'umd',
      libraryExport: 'default',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'voice-widget.css'
      })
    ],
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: false, // Keep console logs for debugging
            },
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    devtool: isDevelopment ? 'source-map' : false,
    resolve: {
      extensions: ['.js'],
      alias: {
        '@voice-sdk': path.resolve(__dirname, '../lib/voice-sdk/dist/esm')
      }
    },
    performance: {
      hints: false,
      maxAssetSize: 500000,
      maxEntrypointSize: 500000
    }
  };
};
