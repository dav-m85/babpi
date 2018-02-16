/* eslint-disable camelcase */
const {updateObject} = require('../reducerUtilities')
const Actions = require('../actions')
const winScore = 10
const log = require('debug')('reducer')

let updateGame = (state, what) => updateObject(state, {game: updateObject(state.game, what)})

function view_0_start (state, {duration, type}) {
  switch (duration) {
    case 'short': return state // hadoken maybe here
    case 'long': return updateGame(state, {is: 'building'})
    default: return state
  }
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function view_1_building (state, {duration}) {
  let players = state.ui.players
  if (state.ui.index === 0 && duration === 'long' && (players.length === 2 || players.length === 4)) {
    // @todo Mode computation here
    let redPlayers, bluePlayers
    switch (players.length) {
      case 2:
        redPlayers = [players[0]]
        bluePlayers = [players[1]]
        break
      case 4:
        redPlayers = [players[0], players[1]]
        bluePlayers = [players[2], players[3]]
        break
      default: return state
    }

    // Swap teams randomly
    if (getRandomInt(2) === 1) {
      console.log('swap team')
      bluePlayers = [redPlayers, redPlayers = bluePlayers][0]
    }

    return updateGame(state, {
      is: 'booked',
      redPlayers,
      bluePlayers,
      redScore: 0,
      blueScore: 0,
      'date': Date.now() / 1000 | 0
    })
  }

  return state
}

function view_2_booked (state, {duration, button, asyncDispatch}) {
  switch (duration) {
    case 'short': return updateGame(state, {is: 'playing'})
    case 'long':
      log('ARCHIVE in view_2_booked')
      setTimeout(() => asyncDispatch(Actions.archive()), 3000)
      return updateGame(state, {is: 'cancelled'})
    default: return state
  }
}

function view_3_playing (state, {duration, button, asyncDispatch}) {
  if (duration === 'short') {
    if (button === 'red') {
      let score = state.game.redScore + 1
      if (score >= winScore) {
        log('ARCHIVE in view_3_playing')
        setTimeout(() => asyncDispatch(Actions.archive()), 15000)
        return updateGame(state, {is: 'win', redScore: score})
      }
      return updateGame(state, {redScore: score})
    } else {
      let score = state.game.blueScore + 1
      if (score >= winScore) {
        log('ARCHIVE in view_3_playing')
        setTimeout(() => asyncDispatch(Actions.archive()), 15000)
        return updateGame(state, {is: 'win', blueScore: score})
      }
      return updateGame(state, {blueScore: score})
    }
  } else {
    if (button === 'red') {
      let score = state.game.redScore - 1
      if (score < 0) {
        log('ARCHIVE in view_3_playing')
        asyncDispatch(Actions.archive())
        return updateGame(state, {is: 'cancelled'})
      }
      return updateGame(state, {redScore: score})
    } else {
      let score = state.game.blueScore - 1
      if (score < 0) {
        log('ARCHIVE in view_3_playing')
        asyncDispatch(Actions.archive())
        return updateGame(state, {is: 'cancelled'})
      }
      return updateGame(state, {blueScore: score})
    }
  }
}

function view_4_win (state, {duration, asyncDispatch}) {
  switch (duration) {
    case 'short':
      log('ARCHIVE in view_4_win')
      asyncDispatch(Actions.archive())
      return state
    case 'long':
      log('ARCHIVE in view_4_win')
      asyncDispatch(Actions.archive()) // new action rematch ?
      return state
    default: return state
  }
}

module.exports = (options) => (state, action) => {
  let {game} = state
  if (!game) {
    return view_0_start(state, action)
  } else {
    switch (game.is) {
      case 'building':
        return view_1_building(state, action)
      case 'booked':
        return view_2_booked(state, action)
      case 'playing':
        return view_3_playing(state, action)
      case 'win':
      case 'cancelled':
        return view_4_win(state, action)
      default:
        return state
    }
  }
}
