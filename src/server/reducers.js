const {combineReducers} = require('redux')
const Actions = require('../actions')
const {createReducer, updateObject} = require('../reducerUtilities')
const log = require('debug')('reducer')
const {byName, byLocale, nameNotIn, flatNames, notIn} = require('../shared')

// bookingExpiration: 60000, // 60s
// winnerDisplayTime: 15000, // 15s
// winScore: 10

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

function game (state = null, action) {
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
    default:
      return state
  }
}

function dbReadReducer (state = [], action) {
  return Object.assign({}, state, action.data)
}

const archiveReducer = require('./archiveReducer')

const identity = (initialState) => (state = initialState, action) => state

const uiReducer = (game, players, state = {
  players: [],
  index: 0
}, action) => {
  if (game && game.is === 'booked' && action.type === Actions.PRESS) {
    return updateObject(state, {ui: updateObject(state.ui, {players: []})})
  }
  if (!(game && game.is === 'building') || action.type !== Actions.PRESS) {
    return state
  }
  // ... hence the game is building and we have a PRESS action here
  // on short we rotate the display, aka just incrementing the index
  // on long we may change the game status (captured later in pressReducer haha)
  if (action.duration === 'short') {
    return updateObject(state, {index: (state.index + 1) % (2 + players.length - state.players.length)})
  } else {
    switch (state.index) {
      case 0: // play the game
        return state
      case 1: // remove one player
        return updateObject(state, {players: state.players.slice(0, -1)})
      default: // add one player to the list
        let availables = flatNames(players).sort(byLocale).filter(notIn(state.players))
        if (availables.length === 0) {
          return state
        }

        let newP = state.players.slice()
        newP.push(availables[state.index - 2])
        return updateObject(state, {
          players: newP,
          index: state.index - 1
        })
    }
  }
}

// This special function archives a game
module.exports = options => (state, action) => {
  let intermediateState = combineReducers({
    clients,
    game,
    games: identity([]),
    options: identity({}),
    players: identity([]),
    ui: uiReducer.bind(null, state ? state.game : {}, state ? state.players : [])
  })(state, action)

  log(JSON.stringify([state.options, intermediateState.options]))

  return createReducer( // crossSliceReducer @see https://redux.js.org/docs/recipes/reducers/BeyondCombineReducers.html
    {
      'DB_READ': dbReadReducer,
      'ARCHIVE': archiveReducer(options),
      'PRESS': require('./pressReducer')(options) // Changes the whole stuff and pilots the screen variable
    }
  )(intermediateState, action)
}
