const Actions = require('../actions')
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
  bind: function (store, reverse) {
    var radio = require('nrf')
      .connect('/dev/spidev0.0', 22, 25) // (spi,ce,irq)
      .channel(0x49)
      .dataRate('250kbps')
      .crcBytes(2)
      .autoRetransmit({count: 15, delay: 4000})

    let red = 'red', blue = 'blue'
    if (reverse) {
      red = 'blue'; blue = 'red'
    }

    radio.begin(function () {
      let rx = radio.openPipe('rx', new Buffer([0x0, 0x0, 0x0, 0x0, 0x34]), {size: 1, autoAck: true})

      rx.on('data', function (data) {
        // first 4 bits are the button identifier, last 4 are duration
        var button = data[0] & 15
        var duration = (data[0] & 240) >> 4
        var press = 'short'
        var whichButton = blue
        if (duration > 1) {
                press = 'long'
        }
        if (button & 1) {
                whichButton = red
        }
        store.dispatch(Actions.pressButton(whichButton,press))
        console.log('Button ' + button)
        console.log('Duration ' + duration)
      })

      rx.on('error', function (e) {
        console.warn('Error sending reply.', e)
      })

      console.log('Radio is ready')
      radio.printDetails()
    })
  }
}
