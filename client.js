;
"use strict";
var Babpi = window.Babpi || {};

// Define controllers
Babpi.BookController = require('./src/client/BookController');
Babpi.ScoreboardController = require('./src/client/ScoreboardController');
Babpi.HistoryController = require('./src/client/HistoryController');

// Export to global
window.Babpi = Babpi;
