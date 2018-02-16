const SocketIo = require('socket.io')
const debug = require('debug')('client')
const Actions = require('../actions')
const jsonpatch = require('fast-json-patch')

// @todo handle smaller payloads with jsonpatch
module.exports = class ClientHandler {
  constructor (store) {
    this.store = store
    this.io = null
  }

  bind (http) {
    this.io = SocketIo(http)
    this.io.on('connection', (socket) => {
      debug('Client connection')

      // We init the client's state
      let currentClientState = this.store.getState()
      socket.emit('state', currentClientState)
      debug('state to client', currentClientState)

      // Send store update to distant client
      const unsubscribe = this.store.subscribe(() => {
        let newClientState = this.store.getState()
        let diff = jsonpatch.compare(currentClientState, newClientState)
        socket.emit('diff-state', diff)
        debug('diff to client', diff)
        currentClientState = newClientState
      })
      this.store.dispatch(Actions.clientConnect())

      // Bind incoming onBook
      socket.on('onBook', (data) => {
        this.store.dispatch(Actions.clientBook(data[0], data[1]))
      })

      socket.on('buttonPress', (data) => {
        debug(data)
        this.store.dispatch(Actions.pressButton(data.color, data.type))
        this.io.emit('moveKen')
      })

      socket.on('disconnect', () => {
        debug('Client is out')
        unsubscribe()
        this.store.dispatch(Actions.clientDisconnect())
      })
    })
  }
}
