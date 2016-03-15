const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const low = require('lowdb')
const storage = require('lowdb/file-sync');
const db = low('db.json', storage);
const Game = require('./src/Game');

var game = new Game(io, db);
game.onStartup();

// Static files
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/scoreboard', function(req, res){
  res.sendFile(__dirname + '/public/scoreboard.html');
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
