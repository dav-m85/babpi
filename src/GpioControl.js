// button is attaced to pin 17, led to 18
var GPIO = require('onoff').Gpio,
    button = new GPIO(17, 'in', 'rising'); // falling edge

module.exports = {
    bind: function(game){
        // ISR
        function interruptHandler(err, state) {
            button.unwatch(interruptHandler);
            setTimeout(function(){
                // If button is already up
                if (button.readSync() == 1) {
                    console.log('redShort');
                    game.trigger('redShort');
                }
                // TODO detect long with readSync
                button.watch(interruptHandler);
            }, 250); // ms
        }

        // Start the interrupt
        button.watch(interruptHandler);
    }
};
