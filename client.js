window.BookController = require('./src/client/BookController');
window.ScoreboardController = require('./src/client/ScoreboardController');

io().on('error', console.error.bind(console));
io().on('message', console.log.bind(console));
