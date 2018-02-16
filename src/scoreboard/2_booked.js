const React = require('react')
const {Red, Blue, swap} = require('./shared')

module.exports = ({game, options}) => {
  let Players = swap(options, <Red>{game.redPlayers.join(' ')}</Red>, <Blue>{game.bluePlayers.join(' ')}</Blue>)
  return <div>
    <h3 className='text-center'>Prêt ?</h3>

    <div className='versus'>{Players.Red} VS {Players.Blue}</div>

    <div className='instruction'>
    . jouer !<br />
    _ annuler la partie
    </div>
  </div>
}
