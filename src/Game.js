var Events = require('ampersand-events');
var assign = require('lodash.assign');

var timeout;
function _clearTimeout() {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
}
function _setTimeout(callback, delay) {
    if (timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(callback, delay);
}

/**
 * Manage game on the server side.
 */
var Game = function(io, db){
    this.io = io;
    this.db = db;
    this.bookingExpiration = 10 * 1000; // 10s
    this.matchExpiration = 10 * 1000; // 10s
    this.winnerDisplayTime = 10 * 1000; // 10s
    this.winScore = 10; // maximum score
    // Status object
    //this.onStartup();
}

// Extend the prototype with the event methods and your own:
assign(Game.prototype, Events, {
    /**
     * Update an incoming client
     */
    onConnect: function(socket){
        console.log('a user connected');
        var that = this;
        // Update current status
        socket.emit('statusChange', this.status);

        // Bind incoming onBook
        socket.on('onBook', this.onBook.bind(this));

        // Bind button press for debug, trigger redLong / blueShort / ...
        socket.on('buttonPress', function(data){
            that.trigger(data.color + data.type.charAt(0).toUpperCase() + data.type.slice(1));
        });
    },

    // Default initial state
    onStartup: function() {
        this.off('redShort blueShort');
        _clearTimeout();

        this.status = {
            'is': 'available'
        };
    },

    // When a booking happened
    onBook: function(data) {
        // TODO choose sides randomly
        this.status = {
            'is': 'booked',
            'redPlayers': ['david'],
            'bluePlayers': ['leo'],
            'redScore': 0,
            'blueScore': 0
        };
        this.io.emit('statusChange', this.status);

        // Register next steps
        this.once('redLong blueLong', this.onStartup); // Book canceled
        this.once('redShort blueShort', this.onMatch); // Book confirmed
        _setTimeout(this.startup, this.bookingExpiration); // Book expired after 10s
    },

    onMatch: function() {
        this.status.is = 'playing';
        this.io.emit('statusChange', this.status);

        // Register next steps
        this.once('redLong blueLong', this.onStartup); // Match canceled
        this.on('redShort blueShort', this.onScore); // TODO CLEAR IT
        _setTimeout(this.startup, this.matchExpiration); // Match took too long after 10s without score
    },

    onScore: function(event) {
        console.log(event);
        // TODO detect who scored
        this.status.redScore++;
        this.io.emit('statusChange', this.status);

        if (this.status.redScore >= this.winScore) {
            this.onWin();
        }
    },

    onWin: function(winners, losers, score) {
        this.off('redShort blueShort');

        this.status.is = 'win';
        this.io.emit('statusChange', this.status);
        // TODO update database

        // Go back to startup screen after 10s
        _setTimeout(this.startup, this.winnerDisplayTime);
    }
});

module.exports = Game
