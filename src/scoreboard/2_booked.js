const React = require('react')
const {Instr, Red, Blue, swap} = require('./shared')

module.exports = ({game, options}) => {
  let Players = swap(options, <Red>{game.redPlayers.join(' ')}</Red>, <Blue>{game.bluePlayers.join(' ')}</Blue>)
  return <div>
    <h3>Prêt ?</h3>
    <p>{Players.Red} VS
      {Players.Blue}</p>
    <Instr>
    . jouer !<br />
    _ annuler la partie
    </Instr>
  </div>
}
