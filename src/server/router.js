const fs = require('fs')
const path = require('path')
const view = path.join.bind(null, __dirname, '../../public')

const respond = (file) => function (req, res) {
  fs.readFile(view(file), 'utf8', function (err, raw) {
    if (err) {
      res.send(err)
    } else {
      res.send(raw)
    }
  })
}

module.exports = function (app, options) {
  app.get('/', respond('index.html'))
  app.get('/history', respond('history.html'))
  app.get('/rank', respond('rank.html'))
  app.get('/scoreboard', respond('scoreboard.html'))
}
