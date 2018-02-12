const React = require('react')
const socket = require('socket.io-client')()
const DiffSocket = require('./diff-socket')

module.exports = (WrappedComponent) => class RemoteStateSocket extends React.Component {
  constructor (props, context) {
    super(props, context)
    // Some state definition
    this.state = {
      currentGame: null,
      players: [],
      games: []
    }
  }

  componentDidMount () {
    DiffSocket(socket, this)
  }

  render () {
    return <WrappedComponent socket={socket} {...this.state} />
  }
}