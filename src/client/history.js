const React = require('react')
const io = require('socket.io-client')

require('../../less/main.less')

class History extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      games: []
    }

    this.socket = io()
  }

  componentDidMount () {
    this.socket.on('state', (data) => {
      this.setState(data)
    })
  }

  render () {
    let games = this.state.games.filter(g => g.is === 'win')
    return <div className='container'>
      <table className='table table-striped'>
        <thead><tr>
          <th>#</th>
          <th>Date</th>
          <th>Score</th>
          <th>Red</th>
          <th>Blue</th>
        </tr></thead>
        <tbody id='gameTable'>{
          games.reverse().map((g, i) => <tr key={i}>
            <td>{i}</td>
            <td>{(new Date(g.date < 1e12 ? g.date * 1000 : g.date)).toLocaleDateString()}</td>
            <td>{g.redScore + '/' + g.blueScore}</td>
            <td className={g.redScore > g.blueScore ? 'danger' : ''}>{g.redPlayers.join(' ')}</td>
            <td className={g.redScore < g.blueScore ? 'primary' : ''}>{g.bluePlayers.join(' ')}</td>
          </tr>)
        }</tbody>
      </table>

      <footer>
        <a href='/'>home</a> |
          <a href='/history'>history</a> |
          <a href='/rank'>rank</a>
      </footer>
    </div>
  }
}

const {render} = require('react-dom')
render(<History />, document.body)
