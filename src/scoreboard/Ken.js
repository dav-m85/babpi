const React = require('react')
const io = require('socket.io-client')

module.exports = class App extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      currentGame: null,
      players: [],
      games: []
    }
  }
  // var $ken = $('.ken');
  // bindKen: function(){
    //       this.initKen();
    //       socket.on('moveKen', function() {
    //             console.log('moveKen');
    //             that.hadoken();
    //         });
    //     },
  //         var $kenPos, $fireballPos;
  //         this.punch = function(){
  //           $ken.addClass('punch');
  //           setTimeout(function() { $ken.removeClass('punch'); }, 150);
  //         };
  //         var kick = function(){
  //           $ken.addClass('kick');
  //           setTimeout(function() { $ken.removeClass('kick'); }, 500);
  //         };
  //         var rkick = function(){
  //           $ken.addClass('reversekick');
  //           setTimeout(function() { $ken.removeClass('reversekick'); }, 500);
  //         };
  //         var tatsumaki = function(){
  //           $ken.addClass('tatsumaki');
  //           setTimeout(function() { $ken.addClass('down'); }, 1500);
  //           setTimeout(function() { $ken.removeClass('tatsumaki down'); }, 2000);
  //         };
  //         this.hadoken = function(){
  //           $ken.addClass('hadoken');
  //           setTimeout(function() { $ken.removeClass('hadoken'); }, 500);
  //           setTimeout(function() {
  //               var $fireball = $('<div/>', { class:'fireball' });
  //               $fireball.appendTo($ken);

  //               var isFireballColision = function(){
  //                   return $fireballPos.left + 75 > $(window).width() ? true : false;
  //               };

  //               var explodeIfColision = setInterval(function(){

  //                   $fireballPos = $fireball.offset();
  //                   //console.log('fireballInterval:',$fireballPos.left);

  //                   if (isFireballColision()) {
  //                       $fireball.addClass('explode').removeClass('moving').css('marginLeft','+=22px');
  //                       clearInterval(explodeIfColision);
  //                       setTimeout(function() { $fireball.remove(); }, 500);
  //                   }

  //               }, 50);

  //               setTimeout(function() { $fireball.addClass('moving'); }, 20);

  //               setTimeout(function() {
  //                   $fireball.remove();
  //                   clearInterval(explodeIfColision);
  //               }, 3020);

  //           }, (250));
  //         };
  //         var shoryuken = function(){
  //           $ken.addClass('shoryuken');
  //           setTimeout(function() { $ken.addClass('down'); }, 500);
  //           setTimeout(function() { $ken.removeClass('shoryuken down'); }, 1000);
  //         };
  //         var jump = function(){
  //           $ken.addClass('jump');
  //           setTimeout(function() { $ken.addClass('down'); }, 500);
  //           setTimeout(function() { $ken.removeClass('jump down'); }, 1000);
  //         };
  //         var kneel = function(){
  //           $ken.addClass('kneel');
  //         };
  //         var walkLeft = function(){
  //           $ken.addClass('walk').css({ marginLeft:'-=10px' });
  //         };
  //         var walkRight = function(){
  //           $ken.addClass('walk').css({ marginLeft:'+=10px' });
  //         };
  // <div className='stage'>
  //   //     <div className='ken stance' />
  //   //   </div>

  render () {
    return <div className='ken stance' />
  }
}
