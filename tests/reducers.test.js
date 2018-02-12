const reducers = require('../src/server/reducers')
const Actions = require('../src/actions')

const aWonGame = {
  is: 'win',
  redPlayers: ['dav'],
  redScore: 5,
  bluePlayers: ['chr'],
  blueScore: 1
}

test('ARCHIVE moves current game to games history', () => {
  let state = reducers({
    currentGame: aWonGame,
    players: [],
    games: []
  }, Actions.archive())

  expect(state.currentGame).toBeNull()
  expect(state.games[0]).toBeTruthy()
})

test('ARCHIVE computes new player rank', () => {
  let state = reducers({
    currentGame: aWonGame,
    players: [],
    games: []
  }, Actions.archive())

  console.log(state)

  expect(state.players.filter(a => a.name === 'dav').pop().mu).toBeTruthy()
})

test('PRESS adds player', () => {
  let state = reducers({
    currentGame: aWonGame,
    players: [],
    games: []
  }, Actions.archive())

  console.log(state)

  expect(state.players.filter(a => a.name === 'dav').pop().mu).toBeTruthy()
})