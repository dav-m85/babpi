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
    console.log('setTimeout ' + delay);
    timeout = setTimeout(callback, delay);
}

/**
 * Manage game on the server side.
 */
var Game = function(io, db){
    this.io = io;
    this.db = db;
    this.bookingExpiration = 10 * 1000; // 10s
    this.winnerDisplayTime = 10 * 1000; // 10s
    this.winScore = 10; // maximum score
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
            var event = data.color + data.type.charAt(0).toUpperCase() + data.type.slice(1);
            console.log(event);
            that.trigger(event);
        });
    },

    // Default initial state
    onStartup: function() {
        console.log('onStartup');
        this.off('redShort blueShort');
        _clearTimeout();

        this.status = {
            'is': 'available'
        };
        this.io.emit('statusChange', this.status);
    },

    // When a booking happened
    onBook: function(data) {
        // TODO choose sides randomly
        this.status = {
            'is': 'booked',
            'redPlayers': ['david'],
            'bluePlayers': ['leo']
        };
        this.io.emit('statusChange', this.status);

        // Register next steps
        this.once('redLong blueLong', this.onStartup); // Book canceled
        this.once('redShort blueShort', this.onMatch); // Book confirmed
        _setTimeout(this.onStartup.bind(this), this.bookingExpiration); // Book expired after 10s
    },

    onMatch: function() {
        this.off('redShort blueShort');
        _clearTimeout();
        this.status.is = 'playing';
        this.status.redScore = 0;
        this.status.blueScore = 0;

        this.io.emit('statusChange', this.status);
        var that = this;
        // Register next steps
        this.once('redLong blueLong', this.onStartup); // Match canceled
        this.on('redShort', function(){
            that.status.redScore++;
            that.onScore();
        });
        this.on('blueShort', function(){
            that.status.blueScore++;
            that.onScore();
        });
    },

    onScore: function() {
        this.io.emit('statusChange', this.status);

        if (this.status.redScore >= this.winScore) {
            this.onWin('red');
        }
        if (this.status.blueScore >= this.winScore) {
            this.onWin('blue');
        }
    },

    onWin: function(winner) {
        this.off('redShort blueShort');

        this.status.is = 'win';
        this.io.emit('statusChange', this.status);
        // TODO update database

        // Go back to startup screen after 10s
        _setTimeout(this.onStartup.bind(this), this.winnerDisplayTime);
    }
});

module.exports = Game
