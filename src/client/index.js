const React = require('react')
const io = require('socket.io-client')

// require('../../less/main.less')

class Booking extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentGame: null,
      players: [],
      games: []
    }

    this.bookGame = this.bookGame.bind(this)
    this.socket = io()
  }

  componentDidMount () {
    this.socket.on('state', (data) => {
      this.setState(data)
    })
  }

  bookGame (event) {
    console.log('SEND')
    event.preventDefault()

    // Clean up
    const clean = (value) => {
      return value.split(',')
        .map(Function.prototype.call, String.prototype.trim)
        .map(Function.prototype.call, String.prototype.toLowerCase)
    }

    let team1 = clean(this.team1.value)
    let team2 = clean(this.team2.value)

    this.socket.emit('onBook', [
      team1,
      team2
    ])

    this.setState({currentGame: true}) // make sure interface disappear
  }

  render () {
    return <div className='container'>
      {!this.state.currentGame
      ? <div>
        <p>Enter players</p>
        <form id='bookAGame' className='form-horizontal'>
          <div className='form-group'>
            <label htmlFor='team1' className='col-sm-3 control-label'>Team #1</label>
            <div className='col-sm-9'>
              <input className='form-control' name='team1' placeholder='Names' ref={(input) => { this.team1 = input }} />
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='team2' className='col-sm-3 control-label'>Team #2</label>
            <div className='col-sm-9'>
              <input className='form-control' name='team2' placeholder='Names' ref={(input) => { this.team2 = input }} />
            </div>
          </div>
          <div className='form-group'>
            <div className='col-sm-offset-3 col-sm-9'>
              <button className='btn btn-default' onClick={this.bookGame}>Book game</button>
            </div>
          </div>
        </form>
      </div>
      : <div>
          Got a booking, come back later.
      </div>
      }
    </div>
  }
}

const {render} = require('react-dom')
render(<Booking />, document.body)
