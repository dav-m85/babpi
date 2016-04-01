module.exports = {
    bind: function(game){
        var radio = require('nrf')
        	.connect('/dev/spidev0.0', 24, 25) //24, 25 - pas 25, 24
        	.channel(0x28)
        	.dataRate('2Mbps')
        	.crcBytes(2)
        	.autoRetransmit({count:15, delay:4000});
        ;

        radio.begin(function () {
            var rx = radio.openPipe('rx', new Buffer([0x0,0x0,0x0,0x0,0x34]), {size:1, autoAck:true});

        	rx.on('data', function (d) {
                switch(d[0]) {
                    case 8:
                        game.trigger('redShort');
                    break;
                    case 16:
                        game.trigger('blueShort');
                    break;
                    case 136:
                        game.trigger('redLong');
                    break;
                    case 144:
                        game.trigger('blueLong');
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
