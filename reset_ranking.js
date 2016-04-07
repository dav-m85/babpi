const fs = require('fs');
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low(__dirname+'/db.json', { storage: storage });
const Players = require('./src/server/Players');
const Ranking = require('./src/server/Ranking');

// Remove all players
db('players').remove({});

var players = new Players(db);
var ranking = new Ranking(players);

// Recompute players statistics out of all won games
db('games')
  .chain()
  .filter({is: 'win'})
  .map(function(game){
    console.log(".");
    ranking.rankWith(game);
  })
  .value();

console.log("done");