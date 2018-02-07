// @see https://lazamar.github.io/dispatching-from-inside-of-reducers/
module.exports = store => next => action => {
  let syncActivityFinished = false
  let actionQueue = []

  function flushQueue () {
    actionQueue.forEach(a => store.dispatch(a)) // flush queue
    actionQueue = []
  }

  function asyncDispatch (asyncAction) {
    actionQueue = actionQueue.concat([asyncAction])

    if (syncActivityFinished) {
      flushQueue()
    }
  }

  const actionWithAsyncDispatch =
      Object.assign({}, action, { asyncDispatch })

  next(actionWithAsyncDispatch)
  syncActivityFinished = true
  flushQueue()
}
