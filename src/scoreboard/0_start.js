const React = require('react')
const {Red, Blue, swap} = require('./shared')

module.exports = ({players, options}) => {
  let Baby = swap(options, <Red>Baby</Red>, <Blue>Baby</Blue>)
  let foot = swap(options, <Red>foot</Red>, <Blue>foot</Blue>)
  let rank = (p) => Math.floor((p.mu - 3 * p.sigma) * 10) / 10
  return <div>
    <h3 className='text-center'>{Baby.Red}{foot.Blue}</h3>

    <div className='menu'>
      {players.sort((a, b) => (rank(b) - rank(a))).map((p, i) => {
        return <div className='menu-item' key={i}>
          {'#' + (i + 1)} {p.name + ' (' + rank(p) + ')'}
        </div>
      })}
    </div>

    <div className='instruction'>
      . pas grand chose<br />
      _ commencer une partie
    </div>
  </div>
}
