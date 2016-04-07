;
var assign = require('lodash.assign');
var Players = function(db){
  this.db = db;
};
assign(Players.prototype, {
  /**
   * Retrieve a player by name, or create it
   * @param name
   * @returns {*}
   */
  getPlayer: function(name) {
    var player = this.db('players')
      .chain()
      .find({name: name})
      .value();

    // Create if does not exist
    if (! player) {
      player = {
        name: name,
        scored: 0,
        gameCount: 0,
        winCount: 0,
        // trueskill parameters
        mu: 0,
        sigma: 0
      };
      this.db('players').push(player);
    }

    if (player.mu == 0 && player.sigma == 0) {
      player.mu = 25.000;
      player.sigma = 8.333;
    }

    return player;
  },

  save: function(player){
    var newRank = Math.floor((player.mu - 3*player.sigma)*10)/10;
    player.rankingDelta = 0;
    if (newRank != player.ranking) {
      player.rankingDelta = Math.floor((player.ranking - newRank)*10)/10;
    }
    player.ranking = newRank;
    this.db('players')
      .chain()
      .find({name: player.name})
      .assign(player)
      .value();
  },

  updateMuSigma: function(name, mu, sigma){
    var player = this.getPlayer(name);
    player.mu = mu;
    player.sigma = sigma;
    this.save(player);
  },

  /**
   * list all players
   */
  all: function(){
    return this.db('players')
      .chain()
      .sortBy('ranking')
      .map(function(player){return player.name+"("+player.ranking+")"}) // player.rankingDelta
      .value();
  }
});

module.exports = Players;