;
var $ = require("jquery");
module.exports = ScoreboardController = function(){
    return {
        run: function(options, players){
            console.log(players);
            options = options || {
                  "address": "ADDRESS OF THIS SERVER"
              };

            var socket = io();
            var playerString = '*** BEST PLAYERS *** ' + players.reverse().join(' ') + ' ';
            playerString = playerString.toUpperCase();
            var $leaderboard = $('.leaderboard');
            window.setInterval(function(){
                // Rotate string
                var tmp = playerString.charAt(0);
                playerString = playerString.substring(1) + tmp;
                $leaderboard.text(playerString);
            }, 300);


            // RaspberryPiControl lives in server code...
            var Control = require('./MockControl');
            var control = new Control(socket);

            var bigInstr = $('.instruction.blink');
            var instr = $('.instruction').not('.blink');
            var score = $('.score');
            var clock = $('.clock');

            socket.on('statusChange', function(data) {
                switch (data.is) {
                    case "available":
                        // clock = time
                        bigInstr.html('Start game on<br />'+options.address);
                        instr.text('');
                        score.text('');
                        $leaderboard.show();
                    break;
                    case "booked":
                        // who has booked
                        // clock = expiration countdown
                        bigInstr.text('Push any button to start');
                        instr.text('Long push to cancel');
                        score.html('<span class="blue">'+data.bluePlayers.join(',')+'</span> VS <span class="red">'+data.redPlayers.join(',')+'</span>');
                        $leaderboard.hide();
                        break;
                    case "playing":
                        bigInstr.text(null);
                        instr.html('Push to score<br />Long push to stop');
                        score.html(
                          '<span class="blue">'+data.bluePlayers.join(',')+'</span> VS <span class="red">'+data.redPlayers.join(',')+'</span><br />'+
                          '<span class="big">'+data.blueScore+' - '+data.redScore+'</span>'
                        );
                        // who is playing
                        // clock = expiration countdown
                    break;
                    case "win":
                        // who has won
                        instr.html('Win');
                        // clock = time
                    break;
                    default:
                        console.log("unknown status "+data.is);
                    break;
                }
            });
        }
    };
};
