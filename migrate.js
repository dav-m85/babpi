const fs = require('fs');
const low = require('lowdb');
const storage = require('lowdb/file-sync');
const db = low(__dirname+'/db.json', { storage: storage });
const Players = require('./src/server/Players');

var players = new Players(db);
players.reset();
console.log("Done");
