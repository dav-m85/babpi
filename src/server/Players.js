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
   * Change player stat
   */
  updatePlayer: function(name, score){
    var player = this.db('players')
      .chain()
      .find({name: name})
      .value();
    if (! player) {
      this.db('players').push({
        name: name,
        scored: score,
        gameCount: 1,
        winCount: score == 10 ? 1 : 0
      });
    } else {
      this.db('players')
        .chain()
        .find({name: name})
        .assign({
          gameCount: player.gameCount + 1,
          scored: player.scored + score,
          winCount: player.winCount + (score == 10 ? 1 : 0),
        })
        .value();
    }
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