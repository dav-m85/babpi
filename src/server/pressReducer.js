/* eslint-disable camelcase */
const {updateObject} = require('../reducerUtilities')
const Actions = require('../actions')
const winScore = 10

let updateGame = (state, what) => updateObject(state, {game: updateObject(state.game, what)})

function view_0_start (state, {duration, type}) {
  switch (duration) {
    case 'short': return state // hadoken maybe here
    case 'long': return updateGame(state, {is: 'building'})
    default: return state
  }
}

function view_1_building (state, {duration}) {
  // 'date': Date.now() / 1000 | 0
  return state
}

function view_2_booked (state, {duration, button, asyncDispatch}) {
  switch (duration) {
    case 'short': return updateGame({is: 'playing'})
    case 'long':
      setTimeout(() => asyncDispatch(Actions.archive()), 3000)
      return updateGame({is: 'cancelled'})
    default: return state
  }
}

function view_3_playing (state, {duration, button, asyncDispatch}) {
  if (duration === 'short') {
    if (button === 'red') {
      let score = ++state.redScore
      if (score >= winScore) {
        setTimeout(() => asyncDispatch(Actions.archive()), 3000)
        return updateGame({is: 'win', redScore: score})
      }
      return updateGame({redScore: score})
    } else {
      let score = ++state.blueScore
      if (score >= winScore) {
        setTimeout(() => asyncDispatch(Actions.archive()), 3000)
        return updateGame({is: 'win', blueScore: score})
      }
      return updateGame({blueScore: score})
    }
  } else {
    // what happens on long click ?
    return state
  }
}

function view_4_win (state, {duration, asyncDispatch}) {
  switch (duration) {
    case 'short':
      asyncDispatch(Actions.archive())
      return state
    case 'long':
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
