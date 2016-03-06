
onStartup = function() {
    // no event
    redPlayers = [];
    bluePlayers = [];
    redScore = 0;
    blueScore = 0;

    // Send statistic data from mongodb
}

onReservation = function(players) {
    // if short press: onMatch
    // on timeout: on Startup (reservation timeout)

    io.emit('message', {
        event: 'onReservation',
        data: players
    });
}

onMatch = function() {
    // if long press: onStartup (match has been canceled)
    // on timeout: on Startup (match too long)
    // if short press: add point
        // and if win, onWin
}

onScore = function() {

}

onWin = function(winners, losers, score) {
    // display score for 10 seconds
    // update database
    insert {date, redPlayers, bluePlayers, redScore, blueScore, redGain, blueGain}
    // onStartup
}
