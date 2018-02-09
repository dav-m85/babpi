const React = require('react')
const io = require('socket.io-client')

require('../../less/main.less')

class Rank extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      players: []
    }

    this.socket = io()
  }

  componentDidMount () {
    this.socket.on('state', (data) => {
      this.setState(data)
    })
  }

  render () {
    let players = this.state.players
    let rank = (p) => Math.floor((p.mu - 3 * p.sigma) * 10) / 10
    return <div className='container'>
      <table className='table table-striped'>
        <tbody>{
          players.sort((a, b) => (rank(b) - rank(a))).map((p, i) => {
            return <tr key={i}>
              <td>{'#' + (i + 1)}</td>
              <td>{p.name + ' (' + rank(p) + ')'}</td>
            </tr>
          })
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
render(<Rank />, document.body)
