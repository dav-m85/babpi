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
const sys = require('sys');

// Argument processing
var options = {
  address: "no address",
  // TODO Reverse blue and red button
  reverse: false
};

// Credits to https://github.com/xxorax/node-shell-escape
function shellescape(a) {
  var ret = [];

  a.forEach(function(s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
      s = "'"+s.replace(/'/g,"'\\''")+"'";
      s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
        .replace(/\\'''/g, "\\'" ); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    ret.push(s);
  });

  return ret.join(' ');
}

process.argv.slice(2).forEach(function (val) {
  if( match = val.match(/^--([^=]+)=?(.+?)?$/)) {
    switch(match[1]) {
      case 'address':
        options.address = match[2];
        break;
      case 'reverse':
        options.reverse = true;
        break;
      default:
        console.log("Cannot understand argument "+match[0]);
        break;
    }
  }
});

var players = (new Players(db));
var game = new Game(io, db, {}, process.arch != 'arm');
var exec = require('child_process').exec;
var child;
game.onStartup();
game.on('onWin', function(status){
  var winners, losers;
  if (status.redScore > status.blueScore) {
    winners = status.redPlayers; losers = status.bluePlayers;
  } else {
    winners = status.bluePlayers; losers = status.redPlayers;
  }
  var data = [];
  winners.forEach(function(value){
    var p = players.getPlayer(value);
    data.push({
      name: p.name,
      mu: p.mu,
      sigma: p.sigma,
      rank: 1
    });
  });
  losers.forEach(function(value){
    var p = players.getPlayer(value);
    data.push({
      name: p.name,
      mu: p.mu,
      sigma: p.sigma,
      rank: 2
    });
  });

  // send data to process
  exec(
    'echo '+shellescape([JSON.stringify(data)])+"|python ranking_app.py",
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error + stderr);
        }
        var result = JSON.parse(stdout);
        result.forEach(function(res){
          players.updateMuSigma(res.name, res.mu, res.sigma);
        });
    }
  );

  console.log(JSON.stringify(data));
});

// Bind GPIO on a RaspberryPi (yes that's an arm architecture)
// @todo this check would be better with http://raspberrypi.stackexchange.com/questions/24733/determine-if-running-on-a-raspberry-pi-in-node-js
if (process.arch == 'arm') {
  console.log("Pi mode");
  try {
    // GPIO = require('onoff').Gpio;
    // var control = require('./src/server/GpioControl');
    // control.bind(GPIO, game);
    var control = require('./src/server/RadioControl');
    control.bind(game);
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

http.listen(80, function(){
    console.log('listening on *:80');
});
