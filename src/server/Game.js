var Events = require('ampersand-events');
var assign = require('lodash.assign');

/**
 * Manage game on the server side.
 */
var Game = function(io, db, options, debug){
    this.io = io;
    this.db = db;
    this.options = assign({
        bookingExpiration: 60000, // 60s
        winnerDisplayTime: 15000, // 15s
        winScore: 10
    }, options || {});
    this.debug = debug;
    this.timeout = null;
};

// Extend the prototype with the event methods and your own:
assign(Game.prototype, Events, {

    _clearEvents: function(){
        this.off('redShort blueShort redLong blueLong');
    },
    _clearTimeout: function() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    },
    _setTimeout: function(callback, delay) {
        this._clearTimeout();
        this.timeout = setTimeout(callback, delay);
    },

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
        //if (this.debug) {
            socket.on('buttonPress', function (data) {
                var event = data.color + data.type.charAt(0).toUpperCase() + data.type.slice(1);
                console.log(event);
                that.trigger(event);
            });
        //}
    },

    // Default initial state
    onStartup: function() {
        console.log('onStartup');
        var that = this;
        this._clearEvents();
        this.on('redShort blueShort redLong blueLong', function(){
            // Acknowledgement that moves Ken
            that.io.emit('moveKen');
            console.log('moveKen');
        });
        this._clearTimeout();

        this.status = {
            'is': 'available'
        };
        this.io.emit('statusChange', this.status);
    },

    // When a booking happened
    onBook: function(players) {
        this._clearEvents();
        // TODO assign regarding ranks, except replays
        var rand = Math.round(Math.random()); // 0 or 1
        console.log(players);
        var redPlayer = players[rand %2];
        var bluePlayer = players[(rand+1) %2];
        // TODO create new player if applicable
        // TODO Send player details to interface
        this.status = {
            is: 'booked',
            redPlayers: redPlayer,
            bluePlayers: bluePlayer
        };
        this.io.emit('statusChange', this.status);

        // Register next steps
        this.once('redLong blueLong', this.onStartup); // Book canceled
        this.once('redShort blueShort', this.onMatch); // Book confirmed
        this._setTimeout(this.onStartup.bind(this), this.options.bookingExpiration); // Book expired after 10s
    },

    onMatch: function() {
        this._clearEvents();
        this._clearTimeout();
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
            this.onWin();
        }
        if (this.status.blueScore >= this.options.winScore) {
            this.onWin();
        }
    },

    onWin: function() {
        this._clearEvents();

        // Rematch options
        var status = this.status;
        this.once('redLong blueLong', function(){
            this.rematch(status);
        });

        this.status.is = 'win';
        this.io.emit('statusChange', this.status);
        this.storeStatus();

        // Recompute players ranking
        this.trigger('onWin', status);

        // Go back to startup screen after 10s
        this._setTimeout(this.onStartup.bind(this), this.options.winnerDisplayTime);
    },

    /**
     * Recreate a match with same players
     */
    rematch: function(status){
        var newStatus = {
            'is': 'booked',
            'redPlayers': status.bluePlayers,
            'bluePlayers': status.redPlayers
        };
        this.status = newStatus;
        this.onMatch();
    },

    storeStatus: function(){
        this.status.date = (new Date).getTime();
        this.db('games').push(this.status);
        this.db.write();
    }
});

module.exports = Game;
