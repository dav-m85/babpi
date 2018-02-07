const SocketIo = require('socket.io')
const debug = require('debug')('client')
const Actions = require('../actions')
//const io = require('socket.io')(http)

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
      /*
      devices.each(function(device){
        socket.emit('model_device', device.serialize());
        device.on('change', function(){
          socket.emit('model_device', device.serialize());
        });
      });

      devices.on('add', function(device){
        socket.emit('model_device', device.serialize());
        device.on('change', function(){
          socket.emit('model_device', device.serialize());
        });
      });

      socket.on('launch_app', function(device){
        debug('Launch app');
        var device = devices.get(device.id)
        device.run();
      });
      */

      // socket.emit('statusChange', this.status);

      // Send store update to distant client
      this.store.subscribe(() => {
        socket.emit('state', this.store.getState())
      })

      // Bind incoming onBook
      // socket.on('onBook', this.onBook.bind(this));

      // Bind button press for debug, trigger redLong / blueShort / ...
      // if (this.debug) {
      socket.on('buttonPress', (data) => {
        debug(data)
        this.store.dispatch(Actions.pressButton(data.color, data.type))
        this.io.emit('moveKen')
      })
            // Dispatch directly action coming from the client
      // socket.on('action', (action) => {
      //   debug('Got action from client', action)
      //   this.store.dispatch(action)
      // })

      socket.on('disconnect', () => {
        debug('Client is out')
        unsubscribe()
        this.store.dispatch(Actions.clientDisconnect())
      })
    })
  }
}
