const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low(__dirname+'/db.json', { storage: storage });
const Game = require('./src/server/Game');
const Players = require('./src/server/Players');
const Ranking = require('./src/server/Ranking');

// Game init
var players = new Players(db);
var ranking = new Ranking(players);
var game = new Game(io, db, {}, process.arch != 'arm');
game.onStartup();
game.on('onWin', function(status){
  ranking.rankWith(status);
});

// Argument processing
var options = {
  address: "no address",
  // TODO Reverse blue and red button
  reverse: false,
  port: 3000
};

var control = null;
process.argv.slice(2).forEach(function (val) {
  if( match = val.match(/^--([^=]+)=?(.+?)?$/)) {
    switch(match[1]) {
      case 'address':
        options.address = match[2];
        break;
      case 'port':
        options.port = match[2];
        break;
      case 'reverse':
        options.reverse = true;
        break;
      case 'control':
        switch(match[2]){
            case 'radio':
                control = require('./src/server/RadioControl');
                control.bind(game, options.reverse);
            break;
            case 'wire':
                control = require('./src/server/GpioControl');
                control.bind(require('onoff').Gpio, game);
            break;
            default:
                throw new Error("Unknown control method "+match[2]);
        }
        break;
      default:
        console.log("Cannot understand argument "+match[0]);
        break;
    }
  }
});

// Static files
app.use(express.static(__dirname + '/public'));

var headerHtm;
fs.readFile(__dirname+'/views/_head.html', 'utf8', function(err, raw){
  headerHtm = raw;
});
var footerHtm;
fs.readFile(__dirname+'/views/_foot.html', 'utf8', function(err, raw){
  footerHtm = raw;
});

app.get('/', function(req, res){
  fs.readFile(__dirname+'/views/index.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%options%*/', JSON.stringify(options));
    raw = raw.replace('/*%players%*/', "[]");
    res.send(headerHtm+raw+footerHtm);
  });
});

app.get('/rank', function(req, res){
  fs.readFile(__dirname+'/views/rank.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%players%*/', JSON.stringify(players.all()));
    res.send(headerHtm+raw+footerHtm);
  });
});

app.get('/scoreboard', function(req, res){
  fs.readFile(__dirname+'/views/scoreboard.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%params%*/', JSON.stringify(options));
    raw = raw.replace('/*%players%*/', JSON.stringify(players.all()));
    res.send(headerHtm+raw+footerHtm);
  });
});

app.get('/history', function(req, res){
  fs.readFile(__dirname+'/views/history.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%games%*/', JSON.stringify(db.object.games || []));
    res.send(headerHtm+raw+footerHtm);
  });
});

io.on('connection', function(socket){
    game.onConnect(socket);

    //io.emit('some event', { for: 'everyone' });
    socket.on('disconnect', function(){
        //console.log('user disconnected');
    });
});

http.listen(options.port, function(){
    console.log('listening on *:'+options.port);
});
