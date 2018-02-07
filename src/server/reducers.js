const {combineReducers} = require('redux')
const Actions = require('../actions')
const {updateObject, updateItemInArray} = require('../reducerUtilities')

const winScore = 10

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

// function currentGame (state = null, action) {
//   switch (action.type) {
//     case Actions.PRESS:
//       // Let's create a new game
//       if (!state) {
//         // No game yet, do nothing...
//         return {
//           'redPlayers': ['dav', 'chr'],
//           'bluePlayers': ['sol', 'aud']
//         }
//       } else {
//         // GAMES ON
//         switch (state.is) {
//           case 'booked':
//             if (action.duration === 'short') {
//               return updateObject(state, {is: 'playing'})
//             } else {
//               return updateObject(state, {is: 'cancelled'})
//             }
//           case 'playing':
//             if (action.duration === 'short') {
//               if (action.button === 'red') {
//                 let score = ++state.redScore
//                 if (score >= winScore) {
//                   return updateObject(state, {
//                     is: 'win',
//                     redScore: score
//                   })
//                 }
//                 return updateObject(state, {redScore: score})
//               } else {
//                 let score = ++state.blueScore
//                 if (score >= winScore) {
//                   return updateObject(state, {
//                     is: 'win',
//                     blueScore: score
//                   })
//                 }
//                 return updateObject(state, {blueScore: score})
//               }
//             } else {
//               console.log('deal with long click while playing')
//             }
//             break
//           case 'win':
//             break
//           case 'cancelled':
//             break
//         }
//       }
//       return null
//     default:
//       return state
//   }
// }

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

// function game (state = null, action) {

// }

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

// function createReducer(initialState, defaultReducer, actionReducers) {
//   return function reducer(state = initialState, action) {
//     if (actionReducers.hasOwnProperty(action.type)) {
//       return actionReducers[action.type](state, action)
//     } else {
//       return state
//     }
//   }
// }

// This special function archives a game
let actionReducers = {}
actionReducers[Actions.ARCHIVE_GAME] = function archive (state, action) {
  // remove from currentGame and put at the top of games
  // store to db :)
  console.log('arcive')
}

// module.exports = createReducer(
//   null,
//   combineReducers({
//     clients,
//     players,
//     games
//   }),
//   actionReducers
// )

module.exports = combineReducers({
  clients,
  players,
  games
})
