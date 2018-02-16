const React = require('react')
const {byName, nameNotIn} = require('../shared')
const {Red, Blue, swap} = require('./shared')

/* @arg props state.screen */
module.exports = ({ui, players}) => {
  let opts = players.slice().sort(byName).filter(nameNotIn(ui.players)).map(a => a.name)
  opts.unshift('Jouer !', 'Enlever joueur')

  return <div>
    <h3 className='text-center'>Sélection des joueurs</h3>

    <div className='menu'>Joueurs: {ui.players.join(' ')}</div>

    <div className='menu'>
      {opts.map((m, k) => { return <div key={k} className='menu-item'>{k === ui.index && <span className='caret' />}{m}</div> })}
    </div>

    <div className='instruction'>
    . suivant<br />
      _ sélection
    </div>
  </div>
}
