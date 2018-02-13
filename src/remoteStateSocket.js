const React = require('react')
const socket = require('socket.io-client')()
const jsonpatch = require('fast-json-patch')

module.exports = (WrappedComponent, initialState) => class RemoteStateSocket extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = initialState
  }

  componentDidMount () {
    socket.on('state', (state) => {
      this.setState(state)
      console.log('STATE', state)
    })

    socket.on('diff-state', (patch) => {
      let state = jsonpatch.deepClone(this.state)
      jsonpatch.applyPatch(state, jsonpatch.deepClone(patch))
      this.setState(state)
      console.log('STATE', state)
    })
  }

  render () {
    return <WrappedComponent socket={socket} {...this.state} />
  }
}
