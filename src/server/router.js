const fs = require('fs')
const path = require('path')
const view = path.join.bind(null, __dirname, '../../views')

module.exports = function (app, options, players, db) {
  var headerHtm
  fs.readFile(view('_head.html'), 'utf8', function (err, raw) {
    headerHtm = raw
  })
  var footerHtm
  fs.readFile(view('_foot.html'), 'utf8', function (err, raw) {
    footerHtm = raw
  })

  app.get('/', function (req, res) {
    fs.readFile(view('index.html'), 'utf8', function (err, raw) {
      raw = raw.replace('/*%options%*/', JSON.stringify(options))
      raw = raw.replace('/*%players%*/', '[]')
      res.send(headerHtm + raw + footerHtm)
    })
  })

  app.get('/rank', function (req, res) {
    fs.readFile(view('rank.html'), 'utf8', function (err, raw) {
      raw = raw.replace('/*%players%*/', JSON.stringify(players.all()))
      res.send(headerHtm + raw + footerHtm)
    })
  })

  app.get('/scoreboard', function (req, res) {
    fs.readFile(view('scoreboard.html'), 'utf8', function (err, raw) {
      raw = raw.replace('/*%params%*/', JSON.stringify(options))
      raw = raw.replace('/*%players%*/', JSON.stringify(players.all()))
      res.send(headerHtm + raw + footerHtm)
    })
  })

  app.get('/history', function (req, res) {
    fs.readFile(view('history.html'), 'utf8', function (err, raw) {
      raw = raw.replace('/*%games%*/', JSON.stringify(db.object.games || []))
      res.send(headerHtm + raw + footerHtm)
    })
  })
}
