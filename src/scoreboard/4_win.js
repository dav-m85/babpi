const React = require('react')

module.exports = (props) => (
  <div>
    <p>
      . ok<br />
      _ rematch
    </p>
    <p>
      <span className='blue'>{blues}</span> VS <span className='red'>{reds}</span><br />
      <span class='big'>{currentGame.blueScore} - {currentGame.redScore}</span>
    </p>
  </div>
)
