var express = require('express');
var app = express();
var fs = require('fs');
var http = require('http').Server(app);
var io = require('socket.io')(http);
    //index = fs.readFileSync(__dirname + '/index.html')

//var game = new Game(io);

// Static files
app.use(express.static('public'));

app.post('/challenge', function(players){
    game.onReservation(players);
    return 'OK';
});

http.listen(3000, function(){
  console.log('listening on *:3001');
});
