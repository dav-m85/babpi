const React = require('react')
const remoteStateSocket = require('../remoteStateSocket')
const moment = require('moment')

require('../../less/client.less')

class History extends React.Component {
  render () {
    let games = (this.props.games || []).filter(g => g.is === 'win')
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
          games.reverse().map((g, i) => {
            let dateWrapper = moment(new Date(g.date < 1e12 ? g.date * 1000 : g.date))
            return <tr key={i}>
              <td>{games.length - i}</td>
              <td>{dateWrapper.format('HH:mm dd DD/MM YYYY')}</td>
              <td>{g.redScore + '/' + g.blueScore}</td>
              <td className={g.redScore > g.blueScore ? 'danger' : ''}>{g.redPlayers.join(' ')}</td>
              <td className={g.redScore < g.blueScore ? 'primary' : ''}>{g.bluePlayers.join(' ')}</td>
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
render(React.createElement(remoteStateSocket(History)), document.body)
