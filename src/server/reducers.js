const {combineReducers} = require('redux')
const Actions = require('../actions')
const {updateObject, updateItemInArray} = require('../reducerUtilities')
const log = require('debug')('reducer')
const { rate, Rating } = require('ts-trueskill')
const winScore = 3
const fs = require('fs')

// bookingExpiration: 60000, // 60s
// winnerDisplayTime: 15000, // 15s
// winScore: 10

// TODO rebook assign regarding ranks, except replays

// Deal with client connection/deconnection from socket.io
function clients (state = 0, action) {
  switch (action.type) {
    case Actions.CLIENT_CONNECT:
      return state + 1
    case Actions.CLIENT_DISCONNECT:
      return state - 1
    default:
      return state
  }
}

function currentGame (state = null, action) {
  switch (action.type) {
    case Actions.CLIENT_BOOK:
      if (!state) {
        // todo random
        return {
          'is': 'booked',
          'redPlayers': action.team1,
          'bluePlayers': action.team2,
          'redScore': 0,
          'blueScore': 0,
          'date': Date.now() / 1000 | 0
        }
      } else {
        log('game already on !')
      }
      return state
    case Actions.PRESS:
      // Let's create a new game
      if (!state) {
        // No game yet, do nothing...
        log('no game yet')
        return state
      } else {
        // GAMES ON
        switch (state.is) {
          case 'booked':
            if (action.duration === 'short') {
              return updateObject(state, {is: 'playing'})
            } else {
              setTimeout(() => action.asyncDispatch(Actions.archive()), 3000)

              return updateObject(state, {is: 'cancelled'})
            }
          case 'playing':
            if (action.duration === 'short') {
              if (action.button === 'red') {
                let score = ++state.redScore
                if (score >= winScore) {
                  setTimeout(() => action.asyncDispatch(Actions.archive()), 3000)

                  return updateObject(state, {
                    is: 'win',
                    redScore: score
                  })
                }
                return updateObject(state, {redScore: score})
              } else {
                let score = ++state.blueScore
                if (score >= winScore) {
                  setTimeout(() => action.asyncDispatch(Actions.archive()), 3000)

                  return updateObject(state, {
                    is: 'win',
                    blueScore: score
                  })
                }
                return updateObject(state, {blueScore: score})
              }
            } else {
              console.log('deal with long click while playing')
              return state
            }
          default:
            return state
        }
      }
    default:
      return state
  }
}

function players (state = null, action) {
  switch (action.type) {
    case Actions.DB_READ:
      return action.data.players
    default:
      return state
  }
}

function games (state = null, action) {
  switch (action.type) {
    case Actions.DB_READ:
      return action.data.games
    // case Actions.PRESS:
    //   // do we have a pending game ?

    //   if (!state) {
    //     action.asyncDispatch(Actions.ken())
    //     return state
    //   } else {

    //   }

    default:
      return state
  }
}

// {
//   clients: int, // num of connected
//   games: [{
//     "is": "win",
//     "redPlayers": [
//       "jj1",
//       "dav"
//     ],
//     "bluePlayers": [
//       "aud",
//       "chr"
//     ],
//     "redScore": 8,
//     "blueScore": 10,
//     "date": 1517608759819
//   }]
// }

function createReducer (defaultReducer, actionReducers) {
  return function (state, action) {
    log('TYPE', action.type)
    if (actionReducers.hasOwnProperty(action.type)) {
      return actionReducers[action.type](state, action)
    } else {
      return defaultReducer(state, action)
    }
  }
}

// function reducer(state, action) {
//   switch (action.type) {
//     case "fetch-start":
//       fetch('wwww.example.com')
//         .then(r => r.json())
//         .then(r => action.asyncDispatch({ type: "fetch-response", value: r }))
//       return state;

//     case "fetch-response":
//       return Object.assign({}, state, { whatever: action.value });;
//   }
// }

function updatePlayers (players, game) {
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

  return players.map(p => Object.assign({}, p))
}

// This special function archives a game
module.exports = options => createReducer(
  combineReducers({
    currentGame,
    clients,
    players,
    games
  }),
  {
    'ARCHIVE': function (state, action) {
      const g = state.currentGame
      if (g && (g.is === 'win' || g.is === 'cancelled')) {
        // Compute player mu/sigma
        let players = state.players
        if (g.is === 'win') {
          players = updatePlayers(players, state.currentGame)
        }

        state = Object.assign({}, state, {
          games: [...state.games, state.currentGame],
          currentGame: null,
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
  }
)
