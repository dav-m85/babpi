const React = require('react')

module.exports = ({redTeam, blueTeam}) => (
  <div>
    <p><span className='blue'>{blueTeam.join(' ')}</span> VS <span className='red'>{redTeam.join(' ')}</span></p>
    <p>
    . jouer !<br />
    _ annuler la partie
    </p>
  </div>
)
