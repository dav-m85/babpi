const SocketIo = require('socket.io')
const debug = require('debug')('client')
const Actions = require('../actions')

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
      const unsubscribe = this.store.subscribe(() => {
        socket.emit('state', this.store.getState())
      })
      this.store.dispatch(Actions.clientConnect())
      socket.emit('state', this.store.getState())

      // Send store update to distant client
      this.store.subscribe(() => {
        socket.emit('state', this.store.getState())
      })

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
