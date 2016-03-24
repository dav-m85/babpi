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

// Argument processing
var options = {
  address: "no address"
};

process.argv.slice(2).forEach(function (val) {
  if( match = val.match(/^--([^=]+)=?(.+?)?$/)) {
    switch(match[1]) {
      case 'address':
        options.address = match[2];
        break;
      default:
        console.log("Cannot understand argument "+match[0]);
        break;
    }
  }
});

var game = new Game(io, db);
game.onStartup();

// Bind GPIO on a RaspberryPi (yes that's an arm architecture)
// @todo this check would be better with http://raspberrypi.stackexchange.com/questions/24733/determine-if-running-on-a-raspberry-pi-in-node-js
if (process.arch == 'arm') {
  console.log("GPIO mode");
  var GPIO = null;
  try {
    GPIO = require('onoff').Gpio;
    var control = require('./src/server/GpioControl');
    control.bind(GPIO, game);
  } catch(e) {
    if ( e.code === 'MODULE_NOT_FOUND' ) {
      console.log("Missing onoff. Please run \"npm require onoff@1.0.4\"");
    }
    throw e;
  }
} else {
  console.log("dev mode");
}

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

app.get('/scoreboard', function(req, res){
  var players = (new Players(db)).all();
  fs.readFile(__dirname+'/views/scoreboard.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%params%*/', JSON.stringify(options));
    raw = raw.replace('/*%players%*/', JSON.stringify(players));
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

http.listen(3000, function(){
    console.log('listening on *:3000');
});
