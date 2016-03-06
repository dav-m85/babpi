module.exports = function(){
    return {run: function(){

        var socket = io();

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
                    console.log("unknown status");
                break;
            }
        });
    }};
}
