const express = require('express')
const app = express()
const http = require('http').Server(app)
const path = require('path')
const fs = require('fs')
const Game = require('./src/server/Game')
const Players = require('./src/server/Players')
const Ranking = require('./src/server/Ranking')
const meow = require('meow')
const debug = require('debug')('app')
const Actions = require('./src/actions')
// Game init
// var players = new Players(db)
// var ranking = new Ranking(players)
// var game = new Game(io, db, {}, process.arch !== 'arm')
// game.onStartup()
// game.on('onWin', (status) => {
//   ranking.rankWith(status)
// })

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

require('./src/server/router')(app, options)

// Store creation
const {createStore} = require('redux')
const reducers = require('./src/server/reducers')
const initialState = {
  'currentGame': null,
  'clients': 0,
  'games': [],
  'players': []
}
const store = createStore(reducers, initialState)
store.subscribe(() => {
  debug('STORE', store.getState())
})

// Load the initial database
let data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')))
store.dispatch(Actions.dbRead(data))

const ClientHandler = require('./src/server/ClientHandler')
const clientHandler = new ClientHandler(store)
clientHandler.bind(http) // not sure on this one

http.listen(options.port, function () {
  console.log('listening on *:' + options.port)
})
