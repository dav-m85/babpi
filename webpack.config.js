const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/client/index.js',
    scoreboard: './src/scoreboard/main.js',
    history: './src/client/history.js',
    rank: './src/client/rank.js'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' },
      {
        test: /\.jsx?/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Babpi booking',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Babpi scoreboard',
      filename: 'scoreboard.html',
      chunks: ['scoreboard']
    }),
    new HtmlWebpackPlugin({
      title: 'Babpi history',
      filename: 'history.html',
      chunks: ['history']
    }),
    new HtmlWebpackPlugin({
      title: 'Babpi rank',
      filename: 'rank.html',
      chunks: ['rank']
    })
  ],
  watchOptions: {
    ignored: [/node_modules/, 'src/server', 'src/tests']
  }
}
