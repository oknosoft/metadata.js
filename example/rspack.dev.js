import path from "node:path";
import { rspack } from '@rspack/core';
import packageJson from '../package.json';

const proxyTarget = process.env.PROXY || packageJson.proxy || 'http://localhost:8080';
const proxyHost = new URL(proxyTarget).host;

module.exports = {
  mode: process.env.NODE_ENV || "development",  // production
  entry: "./example/index.jsx",                 // входная точка - исходный файл
  output:{
    path: path.resolve(__dirname, "./"),        // путь к каталогу выходных файлов - папка public
    publicPath: "/example/",
    filename: "static/js/bundle.js",            // название создаваемого файла
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name].[hash][ext]',
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "./"),
      watch: false,
    },
    proxy: [
      {
        context: ['/couchdb', '/adm', '/auth', '/r/'],
        target: proxyTarget,
        secure: false,
        xfwd: true,
        //pathRewrite: { '^/api': '' },
        // bypass(req, res, proxyOptions) {
        //   if (req.headers.accept.indexOf('html') !== -1) {
        //     console.log('Skipping proxy for browser request.');
        //     return '/index.html';
        //   }
        // },
        onProxyReq(proxyReq, req, res) {
          proxyReq.setHeader('host', proxyHost);
        },
      },
    ],
    port: process.env.PORT || 8081,
    open: true,
  },
  //devtool: false,
  plugins: [
    new rspack.SourceMapDevToolPlugin({}),
    new rspack.HtmlRspackPlugin({
      template: "example/index.html"
    }),
    // new WorkboxPlugin.GenerateSW({
    //   // these options encourage the ServiceWorkers to get in there fast
    //   // and not allow any straggling "old" SWs to hang around
    //   clientsClaim: true,
    //   skipWaiting: true,
    //   maximumFileSizeToCacheInBytes: 180 * 1024 * 1024,
    // }),
  ],
  resolve: {
    fallback: {
      crypto: false,
      levelup: false,
      util: false,
      assert: false,
      stream: false,
      "pouchdb-adapter-memory": false,
    },
  },
  module:{
    rules: [                                   //загрузчик для jsx
      {
        test: /\.(?:js|mjs|jsx|ts|tsx)$/,
        exclude: [/node_modules/],            // исключаем из обработки папку node_modules
        loader: 'builtin:swc-loader',         // определяем загрузчик
        options: {
          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
                development: true,
                refresh: false,
              },
            },
          },
          detectSyntax: 'auto',
        }
      },
      {
        test: /\.md$/,
        type: "asset/source",
      },
      {
        test: /\.css$/i,
        type: "css/auto",
      },
    ]
  }
}
