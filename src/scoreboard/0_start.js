const React = require('react')
const {Instr, Red, Blue, swap} = require('./shared')

module.exports = ({players, options}) => {
  let Baby = swap(options, <Red>Baby</Red>, <Blue>Baby</Blue>)
  let foot = swap(options, <Red>foot</Red>, <Blue>foot</Blue>)
  let rank = (p) => Math.floor((p.mu - 3 * p.sigma) * 10) / 10
  return <div>
    <h3>{Baby.Red}{foot.Blue}</h3>
    <ul className='list'>
      {players.sort((a, b) => (rank(b) - rank(a))).map((p, i) => {
        return <li key={i}>
          {'#' + (i + 1)} {p.name + ' (' + rank(p) + ')'}
        </li>
      })}
    </ul>
    <Instr>
      . hadoken<br />
      _ commencer une partie
    </Instr>
  </div>
}
