;
var $ = require("jquery");
module.exports = HistoryController = function() {
  return {
    run: function (players) {
      var $tbody = $('#gameTable');
      players.reverse().forEach(function (player, index) {
        var row = $('<tr>');
        row.append($('<td>').text('#' + (index +1)));
        row.append($('<td>').text(player));
        $tbody.append(row);
      });
    }
  };
};
