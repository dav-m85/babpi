const React = require('react')

module.exports = ({game}) => (
  <div>
    <p>
      . point<br />
      _ annuler le point
    </p>
    <p>
      <span className='blue'>{game.bluePlayers.join(' ')}</span> VS <span className='red'>{game.redPlayers.join(' ')}</span><br />
      <span class='big'>{game.blueScore} - {game.redScore}</span>
    </p>
  </div>
)
