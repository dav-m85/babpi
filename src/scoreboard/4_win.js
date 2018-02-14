const React = require('react')
const {Instr, Red, Blue, swap} = require('./shared')

module.exports = ({game, options}) => {
  let Players = swap(options, <Red>{game.redPlayers.join(' ')}</Red>, <Blue>{game.bluePlayers.join(' ')}</Blue>)
  let score = swap(options, game.redScore, game.blueScore)
  return <div>
    <h3>Victoire</h3>
    <Instr>
      . ok
    </Instr>
    <p>
      {Players.Red} VS
      {Players.Blue}<br />
      <span className='big'>{score.Red} - {score.Blue}</span>
    </p>
  </div>
}
