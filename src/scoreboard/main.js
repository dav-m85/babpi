const {render} = require('react-dom')
const React = require('react')
const remoteStateSocket = require('../remoteStateSocket')

require('../../less/scoreboard.less')

class App extends React.Component {
  componentDidMount () {
    let socket = this.props.socket

    // Attach default key pressing
    window.addEventListener('keypress', function (e) {
      var char = e.which || e.keyCode
      switch (char) {
        case 97: // 'a'
          socket.emit('buttonPress', {'color': 'red', 'type': 'short'}); break
        case 65: // 'A'
          socket.emit('buttonPress', {'color': 'red', 'type': 'long'}); break
        case 98: // 'b'
          socket.emit('buttonPress', {'color': 'blue', 'type': 'short'}); break
        case 66: // 'B'
          socket.emit('buttonPress', {'color': 'blue', 'type': 'long'}); break
        default:
          console.log(char + ' was not sent to server')
          break
      }
    }, false)
  }

  render () {
    let view
    let {game} = this.props
    if (!game) {
      view = require('./0_start')
    } else {
      switch (game.is) {
        case 'building':
          view = require('./1_building')
          break
        case 'booked':
          view = require('./2_booked')
          break
        case 'playing':
          view = require('./3_playing')
          break
        case 'win':
          view = require('./4_win')
          break
        default:
          view = require('./5_error')
          break
      }
    }

    // instruction blink score
    return React.createElement(view, this.props)
  }
}

// require('../../less/main.less')

render(<div className='scoreboard'>{React.createElement(remoteStateSocket(
  App,
  {
    clients: 0,
    game: null,
    games: [],
    players: [],
    ui: {
      index: 0,
      players: []
    }
  }
))}</div>, document.body)
