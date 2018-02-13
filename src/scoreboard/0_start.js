const React = require('react')

module.exports = ({players}) => {
  let rank = (p) => Math.floor((p.mu - 3 * p.sigma) * 10) / 10
  return <div>
    Ranking !
    <ul>
      {players.sort((a, b) => (rank(b) - rank(a))).map((p, i) => {
        return <tr key={i}>
          <td>{'#' + (i + 1)}</td>
          <td>{p.name + ' (' + rank(p) + ')'}</td>
        </tr>
      })}
    </ul>
    <p>
      . hadoken<br />
      _ commencer une partie
    </p>
  </div>
}
