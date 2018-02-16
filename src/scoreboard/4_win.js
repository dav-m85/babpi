const React = require('react')
const {Red, Blue, swap} = require('./shared')

module.exports = ({game, options}) => {
  let Players = swap(options, <Red>{game.redPlayers.join(' ')}</Red>, <Blue>{game.bluePlayers.join(' ')}</Blue>)
  let Score = swap(options, game.redScore, game.blueScore)
  return <div>
    <h3 className='text-center'>Victoire</h3>

    <div className='versus'>{Players.Red} VS {Players.Blue}</div>

    <div className='score'>{Score.Red} - {Score.Blue}</div>

    <div className='instruction'>
      . ok
    </div>
  </div>
}
