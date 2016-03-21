// button is attaced to pin 17, led to 18
module.exports = {
    bind: function(GPIO, game){
        var buttonRed = new GPIO(17, 'in', 'rising'),
          buttonBlue = new GPIO(18, 'in', 'rising'); // falling edge
        // ISR
        function interruptRedHandler(err, state) {
            buttonRed.unwatch(interruptRedHandler);
            setTimeout(function(){
                // If button is already up
                if (buttonRed.readSync() == 1) {
                    console.log('redShort');
                    game.trigger('redShort');
                }
                // TODO detect long with readSync
                buttonRed.watch(interruptRedHandler);
            }, 250); // ms
        }
        function interruptBlueHandler(err, state) {
            buttonBlue.unwatch(interruptBlueHandler);
            setTimeout(function(){
                // If button is already up
                if (buttonBlue.readSync() == 1) {
                    console.log('blueShort');
                    game.trigger('blueShort');
                }
                // TODO detect long with readSync
                buttonBlue.watch(interruptBlueHandler);
            }, 250); // ms
        }

        // Start the interrupt
        buttonRed.watch(interruptRedHandler);
        buttonBlue.watch(interruptBlueHandler);
    }
};
