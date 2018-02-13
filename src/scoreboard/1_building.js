const React = require('react')
const {byName, nameNotIn} = require('../shared')

/* @arg props state.screen */
module.exports = ({ui, players}) => {
  let opts = players.slice().sort(byName).filter(nameNotIn(ui.players)).map(a => a.name)
  opts.unshift('Jouer !', 'Enlever joueur')

  return <div>
    <p>Sélection des joueurs</p>
    <p>Joueurs: {ui.players.join(' ')}</p>
    <div>
      {opts.map((m, k) => { return <p key={k}>{k === ui.index ? '> ' : ''}{m}</p> })}
    </div>
    <p>
      . suivant<br />
      _ sélection
    </p>
  </div>
}
