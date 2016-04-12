/*
try {
  control = require('./src/server/RadioControl');
  control.bind(game, options.reverse);
} catch(e) {
  if ( e.code === 'MODULE_NOT_FOUND' ) {
    console.log("Missing nrf. Please run \"npm require nrf\"");
  }
  throw e;
}
*/
module.exports = {
    bind: function(game, reverse){
        var radio = require('nrf')
        	.connect('/dev/spidev0.0', 24, 25) //24, 25 - pas 25, 24
        	.channel(0x28)
        	.dataRate('2Mbps')
        	.crcBytes(2)
        	.autoRetransmit({count:15, delay:4000});
        ;

        var red = 'red', blue = 'blue';
        if (reverse) {
            red = 'blue'; blue = 'red';
        }

        radio.begin(function () {
            var rx = radio.openPipe('rx', new Buffer([0x0,0x0,0x0,0x0,0x34]), {size:1, autoAck:true});

        	rx.on('data', function (d) {
                switch(d[0]) {
                    case 8:
                        game.trigger(red+'Short');
                    break;
                    case 16:
                        game.trigger(blue+'Short');
                    break;
                    case 136:
                        game.trigger(red+'Long');
                    break;
                    case 144:
                        game.trigger(blue+'Long');
                    break;
                    case 255:
                        game.trigger('reset');
                    break;
                    default:
                        console.log('Unrecognized data '+d[0]);
                }
            });
        	rx.on('error', function (e) {
        	    console.warn("Error sending reply.", e);
        	});

        	console.log('Radio is ready');
        	radio.printDetails();
        });
    }
};
