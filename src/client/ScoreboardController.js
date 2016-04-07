;
var $ = require("jquery");
var assign = require('lodash.assign');
function ScoreboardController(){

}
assign(ScoreboardController.prototype, {
    initKen: function(){
        var $ken = $('.ken');
        var $kenPos, $fireballPos;

        this.punch = function(){
          $ken.addClass('punch');
          setTimeout(function() { $ken.removeClass('punch'); }, 150);
        };
        var kick = function(){
          $ken.addClass('kick');
          setTimeout(function() { $ken.removeClass('kick'); }, 500);
        };
        var rkick = function(){
          $ken.addClass('reversekick');
          setTimeout(function() { $ken.removeClass('reversekick'); }, 500);
        };
        var tatsumaki = function(){
          $ken.addClass('tatsumaki');
          setTimeout(function() { $ken.addClass('down'); }, 1500);
          setTimeout(function() { $ken.removeClass('tatsumaki down'); }, 2000);
        };
        this.hadoken = function(){
          $ken.addClass('hadoken');
          setTimeout(function() { $ken.removeClass('hadoken'); }, 500);
          setTimeout(function() {
              var $fireball = $('<div/>', { class:'fireball' });
              $fireball.appendTo($ken);

              var isFireballColision = function(){
                  return $fireballPos.left + 75 > $(window).width() ? true : false;
              };

              var explodeIfColision = setInterval(function(){

                  $fireballPos = $fireball.offset();
                  //console.log('fireballInterval:',$fireballPos.left);

                  if (isFireballColision()) {
                      $fireball.addClass('explode').removeClass('moving').css('marginLeft','+=22px');
                      clearInterval(explodeIfColision);
                      setTimeout(function() { $fireball.remove(); }, 500);
                  }

              }, 50);

              setTimeout(function() { $fireball.addClass('moving'); }, 20);

              setTimeout(function() {
                  $fireball.remove();
                  clearInterval(explodeIfColision);
              }, 3020);

          }, (250));
        };
        var shoryuken = function(){
          $ken.addClass('shoryuken');
          setTimeout(function() { $ken.addClass('down'); }, 500);
          setTimeout(function() { $ken.removeClass('shoryuken down'); }, 1000);
        };
        var jump = function(){
          $ken.addClass('jump');
          setTimeout(function() { $ken.addClass('down'); }, 500);
          setTimeout(function() { $ken.removeClass('jump down'); }, 1000);
        };
        var kneel = function(){
          $ken.addClass('kneel');
        };
        var walkLeft = function(){
          $ken.addClass('walk').css({ marginLeft:'-=10px' });
        };
        var walkRight = function(){
          $ken.addClass('walk').css({ marginLeft:'+=10px' });
        };
    },
    run: function(options, players){
        this.initKen();
        options = options || {
              "address": "ADDRESS OF THIS SERVER"
          };

        var socket = io();
        var playerString = '*** BEST PLAYERS *** ' + players.reverse().join(' ') + ' ';
        playerString = playerString.toUpperCase();
        var $leaderboard = $('.leaderboard');
        window.setInterval(function(){
            // Rotate string
            var tmp = playerString.charAt(0);
            playerString = playerString.substring(1) + tmp;
            $leaderboard.text(playerString);
        }, 300);

        var that = this;
        socket.on('moveKen', function() {
            console.log('moveKen');
            that.hadoken();
        });

        // RaspberryPiControl lives in server code...
        var Control = require('./MockControl');
        new Control(socket, options.reverse);

        var bigInstr = $('.instruction.blink');
        var instr = $('.instruction').not('.blink');
        var score = $('.score');
        var clock = $('.clock');

        socket.on('statusChange', function(data) {
            switch (data.is) {
                case "available":
                    // clock = time
                    bigInstr.html('Start game on<br />'+options.address);
                    instr.text('');
                    score.text('');
                    $leaderboard.show();
                    break;
                case "booked":
                    // who has booked
                    // clock = expiration countdown
                    bigInstr.text('Push any button to start');
                    instr.text('Long push to cancel');
                    score.html('<span class="blue">'+data.bluePlayers.join(',')+'</span> VS <span class="red">'+data.redPlayers.join(',')+'</span>');
                    $leaderboard.hide();
                    break;
                case "playing":
                    bigInstr.text(null);
                    instr.html('Push to score<br />Long push to stop');
                    score.html(
                      '<span class="blue">'+data.bluePlayers.join(',')+'</span> VS <span class="red">'+data.redPlayers.join(',')+'</span><br />'+
                      '<span class="big">'+data.blueScore+' - '+data.redScore+'</span>'
                    );
                    // who is playing
                    // clock = expiration countdown
                    break;
                case "win":
                    // who has won
                    instr.html('Win');
                    // clock = time
                    break;
                default:
                    console.log("unknown status "+data.is);
                    break;
            }
        });
    }
});

module.exports = ScoreboardController;
