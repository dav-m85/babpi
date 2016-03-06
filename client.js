window.BookController = require('./src/BookController');
window.ScoreboardController = require('./src/ScoreboardController');

io().on('error', console.error.bind(console));
io().on('message', console.log.bind(console));
