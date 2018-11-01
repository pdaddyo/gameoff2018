const path = require('path')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
   entry: './src/main.ts',
   output: {
      filename: 'compiled.js',
      path: path.resolve(__dirname, 'dist'),
   },
   resolve: {
      extensions: ['.ts'],
   },
   module: {
      rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }],
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
