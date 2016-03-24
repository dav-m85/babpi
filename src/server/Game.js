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

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Manage game on the server side.
 */
var Game = function(io, db, options){
    this.io = io;
    this.db = db;
    this.options = assign({
        bookingExpiration: 30000, // 30s
        winnerDisplayTime: 10000, // 10s
        winScore: 10
    }, options);
}

// Extend the prototype with the event methods and your own:
assign(Game.prototype, Events, {
    /**
     * Update an incoming client
     */
    onConnect: function(socket){
        // console.log('a user connected');
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
    onBook: function(players) {
        // TODO choose sides randomly, assign regarding ranks, except replays
        var rand = Math.round(Math.random()); // 0 or 1
        console.log(players);
        var redPlayer = players[rand %2];
        var bluePlayer = players[(rand+1) %2];
        // TODO create new player if applicable
        // TODO Send player details to interface
        this.status = {
            'is': 'booked',
            'redPlayers': redPlayer,
            'bluePlayers': bluePlayer
        };
        this.io.emit('statusChange', this.status);

        // Register next steps
        this.once('redLong blueLong', this.onStartup); // Book canceled
        this.once('redShort blueShort', this.onMatch); // Book confirmed
        _setTimeout(this.onStartup.bind(this), this.options.bookingExpiration); // Book expired after 10s
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
        this.once('redLong blueLong', function(){ // Match canceled
            that.status.is = 'canceled';
            that.storeStatus();
            that.onStartup();
        });
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

        if (this.status.redScore >= this.options.winScore) {
            this.onWin('red');
        }
        if (this.status.blueScore >= this.options.winScore) {
            this.onWin('blue');
        }
    },

    onWin: function(winner) {
        this.off('redShort blueShort');

        this.status.is = 'win';
        this.io.emit('statusChange', this.status);
        this.storeStatus();

        // Go back to startup screen after 10s
        _setTimeout(this.onStartup.bind(this), this.options.winnerDisplayTime);
    },

    storeStatus: function(){
        this.status.date = (new Date).getTime();
        this.db('games').push(this.status);

        // Build player array
        var yolo = [
            {
                name: "davm",
                mu: 25.0,
                sigma: 8.55,
                rank: 1
            },
            {
                name: "thom",
                mu: 25.0,
                sigma: 8.55,
                rank: 1
            },
            {
                name: "nels",
                mu: 25.0,
                sigma: 8.55,
                rank: 2
            },
            {
                name: "bigm",
                mu: 25.0,
                sigma: 8.55,
                rank: 2
            }
        ];

        // TODO Compute player score here...
        var player = {
            mu: 8.0,
            sigma: 23,
            skill : null,
            name: 'dav', // trigram
            email: 'dav.m85@gmail.com'
        };



        // TODO admin func: rename players
        // rename in player, in games
    }
});

module.exports = Game;
