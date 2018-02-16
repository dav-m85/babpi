const { rate, Rating } = require('ts-trueskill')
const fs = require('fs')
const jsonpatch = require('fast-json-patch')

function updatePlayers (nplayers, game) {
  // lets deep copy players
  let players = jsonpatch.deepClone(nplayers)

  // Add missing player if not in players list
  game.redPlayers.concat(game.bluePlayers).forEach(p => {
    if (players.filter(fp => fp.name === p).length === 0) {
      players.push({
        name: p,
        scored: 0,
        gameCount: 0,
        winCount: 0,
        // trueskill default parameters
        mu: 25.000,
        sigma: 8.333
      })
    }
  })

  // look for a player and return its ratings
  const indexOf = function (p) {
    const index = players.findIndex(fp => fp.name === p)
    if (index < 0) { throw new Error('cannot find player') }
    return index
  }
  // // var newRank = Math.floor((player.mu - 3*player.sigma)*10)/10;
  // // player.rankingDelta = Math.floor((player.ranking - newRank)*10)/10;
  const toRating = function (id) {
    return new Rating(players[id].mu, players[id].sigma)
  }

  const rankThem = function (winners, losers) {
    let winIds = winners.map(indexOf)
    let loseIds = losers.map(indexOf)
    const [winnersRatings, losersRating] = rate([
      winIds.map(toRating), loseIds.map(toRating)
    ])
    winIds.forEach((id, k) => {
      players[id].mu = winnersRatings[k].mu
      players[id].sigma = winnersRatings[k].sigma
      players[id].scored += Math.max(game.redScore, game.blueScore)
      players[id].gameCount += 1
      players[id].winCount += 1
    })
    loseIds.forEach((id, k) => {
      players[id].mu = losersRating[k].mu
      players[id].sigma = losersRating[k].sigma
      players[id].scored += Math.min(game.redScore, game.blueScore)
      players[id].gameCount += 1
    })
  }

  if (game.redScore > game.blueScore) {
    rankThem(game.redPlayers, game.bluePlayers)
  } else {
    rankThem(game.bluePlayers, game.redPlayers)
  }

  return players
}

module.exports = (options) => (state, action) => {
  const g = state.game
  if (g && (g.is === 'win' || g.is === 'cancelled')) {
    // Compute player mu/sigma
    let players = state.players
    if (g.is === 'win') {
      players = updatePlayers(players, state.game)
    }

    state = Object.assign({}, state, {
      games: [...state.games, state.game],
      game: null,
      players
    })
  }

  if (options.db) {
    fs.writeFileSync(options.db, JSON.stringify({
      games: state.games,
      players: state.players
    }), 'utf8')
  }

  return state
}
