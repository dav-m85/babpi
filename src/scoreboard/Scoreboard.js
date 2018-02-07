const React = require('react')
const io = require('socket.io-client')

module.exports = class App extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentGame: null,
      players: [],
      games: []
    }
  }
  componentDidMount () {
    var socket = io()

    socket.on('state', (data) => {
      console.log(data)
      this.setState(data)
    })

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
    let bigInstr = ''
    let instr = ''
    let score = ''
    let {currentGame} = this.state
    if (!currentGame) {
      bigInstr = 'Start game on<br />' + 'address'
      instr = ''
      score = ''
      // $leaderboard.show()
    } else {
      bigInstr = 'Push any button to start'
      instr = 'Long push to cancel'
      score = '<span class="blue">' + currentGame.bluePlayers.join(', ') + '</span> VS <span class="red">' + currentGame.redPlayers.join(', ') + '</span>'
      // $leaderboard.hide()
    }
    // switch ('available') {
    //   case 'available':
    //       // clock = time

    //     break
    //   case 'booked':
    //       // who has booked
    //       // clock = expiration countdown
    //     break
    //   case 'playing':
    //     bigInstr = ''
    //     instr = 'Push to score<br />Long push to stop'
    //     score = '<span class="blue">' + 'aud,sol' + '</span> VS <span class="red">' + 'dav,chr' + '</span><br />' +
    //         '<span class="big">' + 10 + ' - ' + 5 + '</span>'
    //       // who is playing
    //       // clock = expiration countdown
    //     break
    //   case 'win':
    //       // who has won
    //     instr = 'Win'
    //       // clock = time
    //     break
    //   default:
    //     // console.log('unknown status ' + data.is)
    //     break
    // }

    return <div>
      <div className='instruction blink' dangerouslySetInnerHTML={{__html: bigInstr}} />
      <div className='instruction' dangerouslySetInnerHTML={{__html: instr}} />
      <div className='score' dangerouslySetInnerHTML={{__html: score}} />
      <div className='leaderboard' />
      <div className='stage'>
        <div className='ken stance' />
      </div>
    </div>
  }
}
