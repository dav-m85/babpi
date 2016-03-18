const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low(__dirname+'/db.json', { storage: storage });
const Game = require('./src/server/Game');

var address = process.env.ADDRESS || 'raspberry.local:3000';

var game = new Game(io, db);
game.onStartup();

// If your not on arduino, comment this
var control = require('./src/server/GpioControl');
control.bind(game);

// Static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/scoreboard', function(req, res){
  fs.readFile(__dirname+'/public/scoreboard.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%params%*/', JSON.stringify({address:address}));
    res.send(raw);
  });
});

app.get('/history', function(req, res){
  fs.readFile(__dirname+'/public/history.html', 'utf8', function(err, raw){
    raw = raw.replace('/*%games%*/', JSON.stringify(db.object.games || []));
    res.send(raw);
  });
});

io.on('connection', function(socket){
    game.onConnect(socket);

    //io.emit('some event', { for: 'everyone' });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
