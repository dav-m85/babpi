const React = require('react')

module.exports = ({game}) => (
  <div>
    <p><span className='blue'>{game.bluePlayers.join(' ')}</span> VS <span className='red'>{game.redPlayers.join(' ')}</span></p>
    <p>
    . jouer !<br />
    _ annuler la partie
    </p>
  </div>
)
