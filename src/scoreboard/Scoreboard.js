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
    } else {
      let blues = currentGame.bluePlayers.join(', ')
      let reds = currentGame.redPlayers.join(', ')
      switch (currentGame.is) {
        case 'booked':
          bigInstr = 'Push any button to start'
          instr = 'Long push to cancel'
          score = `<span class="blue">${blues}</span> VS <span class="red">${reds}</span>`
          break
        case 'playing':
          bigInstr = ''
          instr = 'Push to score<br />Long push to stop'
          score = `<span class="blue">${blues}</span> VS <span class="red">${reds}</span><br /><span class="big">${currentGame.blueScore} - ${currentGame.redScore}</span>`
          break
        case 'win':
          instr = 'Win'
          break
        default:
          instr = 'Euuhhh'
          break
      }
    }

    return <div>
      <div className='instruction blink' dangerouslySetInnerHTML={{__html: bigInstr}} />
      <div className='instruction' dangerouslySetInnerHTML={{__html: instr}} />
      <div className='score' dangerouslySetInnerHTML={{__html: score}} />
      <div className='leaderboard' />
    </div>
  }
}
