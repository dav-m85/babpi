module.exports = function(){
    return {run: function(){

        var socket = io();
        var that = this;
        socket.on('statusChange', function(data) {
            console.log(data.is);
            switch(data.is){
                case "available":
                    that.onAvailable();
                break;
                default:
                    that.onBooked();
                break;
            }
        });

        var btn = $('button#send');
        $('form#bookAGame').submit(function(event){
            var me1 = $('#me1').val();
            var foe1 = $('#foe1').val();
            socket.emit('onBook', {me1, foe1});
            event.preventDefault();

            // Button loading
            btn.prop('disabled', true);
        });

        this.onAvailable = function(){
            btn.prop('disabled', false);
            $('#available').show();
            $('#booked').hide();
        }
        this.onBooked = function(){
            $('#available').hide();
            $('#booked').show();
        }
    }};
}
