module.exports = function(io, db){
    var that = this;
    this.io = io;
    this.db = db;

    // Status object
    this.status = {
        'is': 'available'
    };

    // Define methods
    /**
     * Update an incoming client
     */
    this.onConnect = function(socket){
        console.log('a user connected');

        // Update current status
        socket.emit('statusChange', this.status);

        // Bind incoming onBook
        socket.on('onBook', that.onBook);
    }
    /*
    console.log('a user connected');

    // User triggered a booking event
    socket.on('book',
    */
    this.onStartup = function() {
        // no event
        redPlayers = [];
        bluePlayers = [];
        redScore = 0;
        blueScore = 0;

        // Send statistic data from mongodb
    }

    this.onBook = function(data) {
        // if short press: onMatch
        // on timeout: on Startup (reservation timeout)

        // data is a reservation
        // db('posts').push({ title: 'lowdb is awesome' })
        this.status = {
            'is': 'booked',
            'red': 'david',
            'blue': 'leo'
        };
        io.emit('statusChange', this.status);
    }

    this.onMatch = function() {
        // if long press: onStartup (match has been canceled)
        // on timeout: on Startup (match too long)
        // if short press: add point
            // and if win, onWin
    }

    this.onScore = function() {

    }

    this.onWin = function(winners, losers, score) {
        // display score for 10 seconds
        // update database
        // insert {date, redPlayers, bluePlayers, redScore, blueScore, redGain, blueGain}
        // onStartup
    }
}
