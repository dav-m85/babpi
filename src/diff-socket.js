const jsonpatch = require('fast-json-patch')

// Modifies state of an object
module.exports = function (socket, target) {
  socket.on('state', (newState) => {
    target.setState(newState)
  })

  socket.on('diff-state', (patch) => {
    console.log(patch)
    let state = target.state
    jsonpatch.applyPatch(state, jsonpatch.deepClone(patch))
    target.setState(state)
  })
}
