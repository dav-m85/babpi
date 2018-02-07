// Remote actions are those happening on the client that get reduced on the server

const types = {
  /**
   * Button's pressed on the table
   */
  PRESS: 'PRESS',

  /**
   * Browser client connection/disconnection
   */
  CLIENT_CONNECT: 'CLIENT_CONNECT',
  CLIENT_DISCONNECT: 'CLIENT_DISCONNECT',

  // when database has been read
  DB_READ: 'DB_READ',

  KEN: 'KEN',

  ARCHIVE: 'ARCHIVE'
}

const simpleAction = (actionType) => () => ({type: actionType})

module.exports = Object.assign({}, types, {
  clientConnect: simpleAction(types.CLIENT_CONNECT),
  clientDisconnect: simpleAction(types.CLIENT_DISCONNECT),
  dbRead: (data) => ({type: types.DB_READ, data}),
  // { color: 'red', type: 'short' }
  pressButton: (button, duration) => ({type: types.PRESS, button, duration}),
  ken: simpleAction(types.KEN)
})
