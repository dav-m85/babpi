;
var assign = require('lodash.assign');
var Players = require('./Players');
var execSync = require('child_process').execSync;

var Ranking = function(players){
  if (!players instanceof Players) {
    throw new Error("Need a Players instance");
  }
  this.players = players;
};

// Credits to https://github.com/xxorax/node-shell-escape
function shellescape(a) {
  var ret = [];

  a.forEach(function(s) {
    if (/[^A-Za-z0-9_\/:=-]/.test(s)) {
      s = "'"+s.replace(/'/g,"'\\''")+"'";
      s = s.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
        .replace(/\\'''/g, "\\'" ); // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    ret.push(s);
  });

  return ret.join(' ');
}

assign(Ranking.prototype, {
  rankWith: function(status) {
    var winners, losers;
    var that = this;

    status.redPlayers.forEach(function(name){
      var player = that.players.getPlayer(name);
      player.gameCount++;
      player.scored += status.redScore;
      player.winCount += status.redScore > status.blueScore ? 1 : 0;
      that.players.save(player);
    });

    status.bluePlayers.forEach(function(name){
      var player = that.players.getPlayer(name);
      player.gameCount++;
      player.scored += status.blueScore;
      player.winCount += status.blueScore > status.redScore ? 1 : 0;
      that.players.save(player);
    });

    if (status.redScore > status.blueScore) {
      winners = status.redPlayers; losers = status.bluePlayers;
    } else {
      winners = status.bluePlayers; losers = status.redPlayers;
    }
    var data = [];
    winners.forEach(function(value){
      var p = that.players.getPlayer(value);
      data.push({
        name: p.name,
        mu: p.mu,
        sigma: p.sigma,
        rank: 1
      });
    });
    losers.forEach(function(value){
      var p = that.players.getPlayer(value);
      data.push({
        name: p.name,
        mu: p.mu,
        sigma: p.sigma,
        rank: 2
      });
    });

    // send data to process
    var stdout = execSync('python ranking_app.py', {
      input: JSON.stringify(data),
      timeout: 1000
    });

    var result = JSON.parse(stdout);
    result.forEach(function(res){
      that.players.updateMuSigma(res.name, res.mu, res.sigma);
    });
  }
});

module.exports = Ranking;
