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
    let title = ''
    let instr = ''
    let main = ''
    let score = ''
    let {currentGame} = this.state
    if (!currentGame) {
      title = <p>Start game on<br /></p>
      instr = <p>
        . hadoken<br />
        _ commencer une partie
      </p>
      score = ''
    } else {
      let blues = currentGame.bluePlayers.join(', ')
      let reds = currentGame.redPlayers.join(', ')
      switch (currentGame.is) {
        case 'build':
          title = 'Sélection des joueurs'
          main = this.state.screen && this.state.screen.options.map((m, k) => { return <p key={k}>{k === 0 ? '> ' : ''}{m}</p> })
          instr = <p>
            . suivant<br />
            _ sélection
          </p>
          score = <p><span className='blue'>{blues}</span> VS <span className='red'>{reds}</span></p>
          break
        case 'booked':
          title = ''
          instr = <p>
            . jouer !<br />
            _ annuler la partie
          </p>
          score = <p><span className='blue'>{blues}</span> VS <span className='red'>{reds}</span></p>
          break
        case 'playing':
          title = ''
          instr = <p>
            . point<br />
            _ annuler le point<br />
            _ + _ annuler la partie
          </p>
          score = <p>
            <span className='blue'>{blues}</span> VS <span className='red'>{reds}</span><br />
            <span class='big'>{currentGame.blueScore} - {currentGame.redScore}</span>
          </p>
          break
        case 'win':
          title = 'Win'
          break
        default:
          title = 'Euuhhh'
          break
      }
    }

    return <div>
      <div className='instruction blink'>{title}</div>
      {main}
      <div className='instruction'>{instr}</div>
      <div className='score'>{score}</div>
    </div>
  }
}
