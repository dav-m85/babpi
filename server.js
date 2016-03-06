const express = require('express');
const app = express();
const fs = require('fs');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const low = require('lowdb')
const storage = require('lowdb/file-sync')
const db = low('db.json', { storage })

//var game = new Game(io);

// Static files
app.use(express.static('public'));

app.get('/book', function(req, res){
  res.sendFile(__dirname + '/public/book.html');
});

io.on('connection', function(socket){
    console.log('a user connected');

    // User triggered a booking event
    socket.on('book', function(data){
        //data is a reservation
        db('posts').push({ title: 'lowdb is awesome' })
        socket.emit('onBook', {});
    });

    //io.emit('some event', { for: 'everyone' });
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
});


http.listen(3000, function(){
  console.log('listening on *:3001');
});
