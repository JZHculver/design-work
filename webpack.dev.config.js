var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var pxtorem = require('postcss-pxtorem');
//var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const scriptPort = process.env.SCRIPT_PORT || 3004;
var origin = [
  path.resolve('src/common'),
  path.resolve('src/client'),
];
/*let extractCSS = new ExtractTextPlugin(
  {
    filename: 'static/styles/default/vendor.min.css',

    disable: true
  });

let extractLESS = new ExtractTextPlugin({
  filename: 'static/styles/default/index.min.css',
  disable: true
});*/


const svgDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''),  // 1. 属于 antd-mobile 内置 svg 文件
  path.resolve(__dirname, 'src/client/styles/svgs'),  // 2. 自己私人的 svg 存放目录
];

var config = {
  entry: {
    'index': ['./src/client']

  },

  output: {
    publicPath: `http://localhost:${scriptPort}/`,
    path: path.join(__dirname, './'),
    filename: 'static/scripts/[name].js'
  },
  resolve: {
    extensions: [".web.js", ".js", ".jsx"],
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  module: {
    // root: origin,
    // modulesDirectories: ['node_modules'],

    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: origin,
        query: {
          plugins: [["import", {"style": "css", "libraryName": "antd"}]],
          cacheDirectory: true
        }
      }, {
        test: /\.(jpg|png|gif|ico)$/,
        loader: 'url-loader',
        options: {
          limit: 8192
        },
        include: origin,
      }, {
        test: /\.less$/,
        use: [
          {loader: 'style-loader'},
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
                'font-size-base': '28px',
               // 'brand-primary': '#ffd200'
              }
            }
          },

        ],


      }, {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
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

      },
      {
        test: /\.(svg)$/i,
        loader: 'svg-sprite-loader',
        include: svgDirs,  // 把 svgDirs 路径下的所有 svg 文件交给 svg-sprite-loader 插件处理
      }
    ]
  },

  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"',
      'process.env.__CLIENT__': 'true',
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./manifest.development.json')
    }),
    //extractCSS,
    //extractLESS,
    new webpack.HotModuleReplacementPlugin(),

    new webpack.NamedModulesPlugin()


  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    host: '0.0.0.0',
    hot: true,
    inline: true,
    port: scriptPort,
  },
  devtool: 'source-map',
  cache: true,
};

module.exports = config
