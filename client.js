window.BookController = require('./src/BookController');

io().on('error', console.error.bind(console));
io().on('message', console.log.bind(console));
