const path = require('path')

module.exports = {
  entry: './client.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'build.js'
  },
  module: {
    rules: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }
    ]
  }
}
