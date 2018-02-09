// Remote actions are those happening on the client that get reduced on the server

const types = {
  /**
   * Button's pressed on the table
   */
  PRESS: 'PRESS',

  CLIENT_BOOK: 'CLIENT_BOOK',

  /**
   * Browser client connection/disconnection
   */
  CLIENT_CONNECT: 'CLIENT_CONNECT',
  CLIENT_DISCONNECT: 'CLIENT_DISCONNECT',

  // when database has been read
  DB_READ: 'DB_READ',

  KEN: 'KEN',

  COMPUTE_RANK: 'COMPUTE_RANK',

  ARCHIVE: 'ARCHIVE'
}

const simpleAction = (actionType) => () => ({type: actionType})

module.exports = Object.assign({}, types, {
  clientConnect: simpleAction(types.CLIENT_CONNECT),
  clientDisconnect: simpleAction(types.CLIENT_DISCONNECT),
  clientBook: (team1, team2) => ({type: types.CLIENT_BOOK, team1, team2}),
  computeRank: simpleAction(types.COMPUTE_RANK),
  dbRead: (data) => ({type: types.DB_READ, data}),
  // { color: 'red', type: 'short' }
  pressButton: (button, duration) => ({type: types.PRESS, button, duration}),
  ken: simpleAction(types.KEN),
  archive: simpleAction(types.ARCHIVE)
})
