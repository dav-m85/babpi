;
var $ = require("jquery");
module.exports = HistoryController = function() {
  return {
    run: function (games) {
      //var $ = require("jquery");
      var $tbody = $('#gameTable');

      games.reverse().forEach(function (game, index) {
        if(game.is != 'win'){return;}
        var row = $('<tr>');
        row.append($('<td>').text(games.length - index));
        row.append($('<td>').text((new Date(game.date)).toLocaleDateString()));
        row.append($('<td>').text(game.redScore + "/"+ game.blueScore));

        row.append($('<td>').text(game.redPlayers.join(' '))
          .toggleClass('danger', (game.redScore > game.blueScore)
        ));
        row.append($('<td>').text(game.bluePlayers.join(' '))
          .toggleClass('primary', (game.redScore < game.blueScore)
        ));

        $tbody.append(row);
      });
    }
  };
};
