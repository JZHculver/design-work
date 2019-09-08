var path = require('path');
var webpack = require('webpack');
var moment = require('moment')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');

var origin = [
  path.resolve('src/common'),
  path.resolve('src/client'),
];
let extractCSS = new ExtractTextPlugin('styles/default/vendor.min.css');
let extractLESS = new ExtractTextPlugin('styles/default/index.min.css');
var nowDateStr = moment().format("YYYY-MM-DD HH:mm:ss")
const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  path.resolve(__dirname, 'src/client/styles/svgs'),  // 2. 自己私人的 svg 存放目录
];
var config = {
  entry: {
    'index': './src/client'
  },
  output: {
    //comments: false,
    publicPath: '/',
    path: path.join(__dirname, 'static'),
    filename: 'scripts/[name].min.js'
  },
  resolve: {
    extensions: [".web.js", ".js", ".jsx"],
    alias: {
      src:  path.resolve(__dirname, './src')
    }
  },
  module: {
    //root: origin,
    //modulesDirectories: ['node_modules'],
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: origin,
        query: {
          cacheDirectory: true
        }
      }, {
        test: /\.(jpg|png|gif|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'styles/default/images/[hash:8].[name].[ext]'
        },
        include: origin,
      }, {
        test: /\.less$/,
        loader: extractLESS.extract({
          fallback: 'style-loader',
          use: [

            {
              loader: 'css-loader?importLoaders=2',
              options: {
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  pxtorem({
                    rootValue: 100,
                    propList: ['*']
                  })
                ]
              }
            },

            {
              loader: 'less-loader',
              options: {
                modifyVars: {
                  'font-size-base': '28px'
                }
              }
            },

          ],
        }),
      }, {
        test: /\.css$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: [

            {
              loader: 'css-loader?importLoaders=1',
              options: {
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  pxtorem({
                    rootValue: 100,
                    propList: ['*']
                  })
                ]
              }
            }
          ],
        }),
      }, {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
      }
    ]
  },
  plugins: [
    //new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      'process.env.__CLIENT__': 'true',
    }),
    // webpack3已经移除DedupePlugin和默认设置OccurenceOrderPlugin[https://webpack.js.org/guides/migrating/]
    //new webpack.optimize.DedupePlugin(),
    //new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false
      }
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.production.json')
    }),
    new webpack.BannerPlugin(`智能机器人\nupdate: ${nowDateStr}`),
    extractCSS,
    extractLESS,
  ]
};

module.exports = config;
