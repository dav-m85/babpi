;
var assign = require('lodash.assign');
var Players = function(db){
  this.db = db;
};
assign(Players.prototype, {
  /**
   * Use games to rebuild the player database
   */
  reset: function(){
    // empty player database
    this.db('players').remove({});

    var that = this;
    // Recompute players statistics out of games
    // filter win
    this.db('games')
      .chain()
      .filter({is: 'win'})
      .map(function(game){
        game.redPlayers.map(function(player){
          that.updatePlayer(player, game.redScore);
        });
        game.bluePlayers.map(function(player){
          that.updatePlayer(player, game.blueScore);
        });
      })
      .value();
  },

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

  /**
   * Change player stat
   */
  updatePlayer: function(name, score){
    var player = this.getPlayer(name);
    this.db('players')
      .chain()
      .find({name: name})
      .assign({
        gameCount: player.gameCount + 1,
        scored: player.scored + score,
        winCount: player.winCount + (score == 10 ? 1 : 0)
      })
      .value();
  },

  save: function(player){
    console.log("Saving",player);
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
      .sortBy('winCount')
      .map(function(player){return player.name+"("+player.winCount+"/"+player.gameCount+")"})
      .value();
  }
});

module.exports = Players;