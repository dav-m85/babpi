const React = require('react')
const {byName, nameNotIn} = require('../shared')
const {Instr, Red, Blue, swap} = require('./shared')

/* @arg props state.screen */
module.exports = ({ui, players}) => {
  let opts = players.slice().sort(byName).filter(nameNotIn(ui.players)).map(a => a.name)
  opts.unshift('Jouer !', 'Enlever joueur')

  return <div>
    <h3>Sélection des joueurs</h3>
    <p>Joueurs: {ui.players.join(' ')}</p>
    <div>
      {opts.map((m, k) => { return <p key={k}>{k === ui.index ? '> ' : ''}{m}</p> })}
    </div>
    <Instr>
    . suivant<br />
      _ sélection
    </Instr>
  </div>
}
