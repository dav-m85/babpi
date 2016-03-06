module.exports = function(){
    return {run: function(){

        var socket = io();

        socket.on('statusChange', function(data) {
            console.log(data)

            // $('form#bookAGame').hide();
            // $('#gotBook').show();
        });

        $('form#bookAGame').submit(function(event){
            var me1 = $('#me1').val();
            var foe1 = $('#foe1').val();
            console.log({me1, foe1});
            socket.emit('onBook', {me1, foe1});
            event.preventDefault();

            // Button loading
            var btn = $('button#send').prop('disabled', true);
        });

    }};
}
