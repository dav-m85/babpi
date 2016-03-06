var Events = require('ampersand-events');
var assign = require('lodash.assign');

// Create some constructor
var MockInterface = function () {



    // press a => short click player A
    // press A => long click player A
    // press b => ...
    // press B => ...
};

// Extend the prototype with the event methods and your own:
assign(MockInterface.prototype, Events, {
    myOtherMethods: function () {}
});


module.exports = MockInterface
