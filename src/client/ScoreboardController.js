module.exports = function(){
    return {
        run: function(options){
            options = options || {
                  "address": "ADDRESS OF THIS SERVER"
              };

            var socket = io();

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
                        bigInstr.html('Defy anyone on<br />'+options.address);
                        instr.text('');
                        score.text('');
                    break;
                    case "booked":
                        // who has booked
                        // clock = expiration countdown
                        bigInstr.text('Push any button to start');
                        instr.text('Long push to cancel');
                        score.html('<span class="red">'+data.redPlayers.join(',')+'</span> VS <span class="blue">'+data.bluePlayers.join(',')+'</span>');
                    break;
                    case "playing":
                        bigInstr.text(null);
                        instr.html('Push to score<br />Long push to stop');
                        score.html(
                          '<span class="red">'+data.redPlayers.join(',')+'</span> VS <span class="blue">'+data.bluePlayers.join(',')+'</span><br />'+
                          '<span class="big">'+data.redScore+' - '+data.blueScore+'</span>'
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
}
