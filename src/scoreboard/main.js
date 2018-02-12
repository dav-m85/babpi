const {render} = require('react-dom')
const React = require('react')
const remoteStateSocket = require('../remoteStateSocket')
const App = remoteStateSocket(require('./Scoreboard'))

// require('../../less/main.less')

render(<App />, document.body)
