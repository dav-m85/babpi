var Events = require('ampersand-events');
var assign = require('lodash.assign');

/**
 * Fake button press with keyboard, for testing.
 * press a => short click on Red
 * press maj+a => long click on Red
 * press b => ...
 * press maj+b => ...
 */
var MockControl = function (socket, reverse) {
    window.addEventListener("keypress", function(e){
        var char = event.which || event.keyCode;
        var red = 'red', blue = 'blue';
        if (reverse) {
            red = 'blue'; blue = 'red';
        }
        switch(char) {
            case 97: // 'a'
                socket.emit('buttonPress', {'color': red, 'type': 'short'}); break;
            case 65: // 'A'
                socket.emit('buttonPress', {'color': red, 'type': 'long'}); break;
            case 98: // 'b'
                socket.emit('buttonPress', {'color': blue, 'type': 'short'}); break;
            case 66: // 'B'
                socket.emit('buttonPress', {'color': blue, 'type': 'long'}); break;
            default:
                console.log(char + " was not sent to server");
                break;
        }
    }, false);
};

// Extend the prototype with the event methods and your own:
assign(MockControl.prototype, Events, {});

module.exports = MockControl
