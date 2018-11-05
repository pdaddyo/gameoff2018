const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
   entry: './src/main.ts',
   output: {
      filename: 'compiled.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/dist/',
   },
   resolve: {
      extensions: ['.ts'],
   },
   module: {
      rules: [
         { test: /\.tsx?$/, loader: 'ts-loader' },
         {
            test: /\.(png|jpg|gif|babylon)$/i,
            use: [
               {
                  loader: 'url-loader',
                  options: {
                     limit: 8192,
                  },
               },
            ],
         },
         {
            test: /\.exec.js$/i,
            use: [
               {
                  loader: 'script-loader',
               },
            ],
         },
      ],
   },
   mode: 'development',
   externals: {
      oimo: true,
      cannon: true,
      earcut: true,
      dat: true,
   },
   plugins: [
      new BrowserSyncPlugin({
         host: 'localhost',
         port: 2910,
         server: { baseDir: ['.'] },
      }),
   ],
}
