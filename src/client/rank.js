const React = require('react')
const remoteStateSocket = require('../remoteStateSocket')

require('../../less/client.less')

class Rank extends React.Component {
  render () {
    let players = this.props.players || []
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
render(React.createElement(remoteStateSocket(Rank)), document.body)
