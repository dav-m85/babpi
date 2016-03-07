module.exports = function(){
    return {
        run: function(){

            var socket = io();

            // RaspberryPiControl lives in server code...
            var Control = require('./MockControl');
            var control = new Control(socket);

            socket.on('statusChange', function(data) {
                switch (data.is) {
                    case "available":
                        $('#available').show();
                        $('#booked').hide();
                    break;
                    case "booked":
                        $('#available').hide();
                        $('#booked').show();
                    break;
                    default:
                        console.log("unknown status "+data.is);
                    break;
                }
            });
        }
    };
}
