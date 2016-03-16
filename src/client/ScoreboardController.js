module.exports = function(){
    return {
        run: function(){

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
                        bigInstr.html('Defy anyone on<br />ADRESS OF SERVER');
                        instr.text('');
                        score.text('');
                    break;
                    case "booked":
                        // who has booked
                        // clock = expiration countdown
                        bigInstr.text('Push any button to start');
                        instr.text('Long push to cancel');
                        score.text(data.redPlayers.join(',')+' VS '+data.bluePlayers.join(','));
                    break;
                    case "playing":
                        bigInstr.text(null);
                        instr.html('Push to score<br />Long push to stop');
                        score.text(data.redScore+' - '+data.blueScore);
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
