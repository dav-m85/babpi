const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const path = require('path')
const db = low(path.join(__dirname, 'db.json'), { storage: storage })
const Game = require('./src/server/Game')
const Players = require('./src/server/Players')
const Ranking = require('./src/server/Ranking')
const meow = require('meow')

// Game init
var players = new Players(db)
var ranking = new Ranking(players)
var game = new Game(io, db, {}, process.arch !== 'arm')
game.onStartup()
game.on('onWin', (status) => {
  ranking.rankWith(status)
})

// Argument processing
const cli = meow(`
    Usage
      $ node server.js

    Options
      --address
      --control
      --port
      --reverse

    Examples
      $ node server.js --control=radio
`, {
  flags: {
    address: {type: 'string', default: 'no address'},
    control: {type: 'string', default: 'debug'},
    port: {type: 'string', default: '3000'},
    reverse: {type: 'boolean', default: false}
  }
})
const options = cli.flags
switch (options.control) {
  case 'radio':
    require('./src/server/RadioControl').bind(game, options.reverse)
    break
  case 'wire':
    require('./src/server/GpioControl').bind(require('onoff').Gpio, game)
    break
  case 'debug':
    break
  default:
    throw new Error('Unknown control method ' + options.control)
}

// DEV
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config.js')
const compiler = webpack(webpackConfig)

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: webpackConfig.output.publicPath
}))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

require('./src/server/router')(app, options, players, db)

io.on('connection', function (socket) {
  game.onConnect(socket)

  // io.emit('some event', { for: 'everyone' });
  socket.on('disconnect', function () {
    console.log('user disconnected')
  })
})

http.listen(options.port, function () {
  console.log('listening on *:' + options.port)
})
