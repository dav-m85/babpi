;
var $ = require("jquery");
module.exports = HistoryController = function() {
  return {
    run: function (games) {
      //var $ = require("jquery");
      var $tbody = $('#gameTable');

      games.reverse().forEach(function (game, index) {
        var isWin = game.is == 'win';
        var row = $('<tr>');
        row.append($('<td>').text(games.length - index));
        row.append($('<td>').text((new Date(game.date)).toLocaleDateString()));
        row.append($('<td>').text(game.is));
        row.append($('<td>').text(game.redPlayers.join(' ') + " (" + game.redScore + ")")
          .toggleClass('success', (isWin && (game.redScore > game.blueScore))
        ));
        row.append($('<td>').text(game.bluePlayers.join(' ') + " (" + game.blueScore + ")")
          .toggleClass('success', (isWin && (game.redScore < game.blueScore))
        ));

        $tbody.append(row);
      });
    }
  };
};
