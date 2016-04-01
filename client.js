;
"use strict";
var Babpi = window.Babpi || {};

// Define controllers
Babpi.BookController = require('./src/client/BookController');
Babpi.ScoreboardController = require('./src/client/ScoreboardController');
Babpi.HistoryController = require('./src/client/HistoryController');
Babpi.RankController = require('./src/client/RankController');

// Export to global
window.Babpi = Babpi;
