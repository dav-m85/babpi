;
var $ = require("jquery");
module.exports = BookController = function(){
    return {run: function(options, players){

        var socket = io();
        socket.on('error', console.error.bind(console));

        var that = this;
        socket.on('statusChange', function(data) {
            console.log(data.is);
            switch(data.is){
                case "available":
                    that.onAvailable();
                break;
                default:
                    that.onBooked();
                break;
            }
        });

        function validateInput($element, errCb){
            var $group= $element.parents('.form-group');
            var violations = [];
            $group.removeClass('has-error');
            var value = $element.val();

            // Empty value
            if (!value) {
                violations.push($element.attr('id')+' should not be empty');
            }

            // Clean up
            value = value.split(',')
              .map(Function.prototype.call, String.prototype.trim)
              .map(Function.prototype.call, String.prototype.toLowerCase);

            // Report errors
            if (violations.length > 0) {
                $group.addClass('has-error');
                errCb(violations);
                return [];
            }
            return value;
        }

        var btn = $('button#send');
        $('form#bookAGame').submit(function(event){
            event.preventDefault();

            var errors = [];
            function cbErr(error){errors = errors.concat(error);}

            var team1 = validateInput($('#team1'), cbErr);
            var team2 = validateInput($('#team2'), cbErr);

            if (errors.length == 0) {
                socket.emit('onBook', [
                    team1,
                    team2
                ]);

                // Button loading
                btn.prop('disabled', true);
            } else {
                // display errors
            }
        });

        this.onAvailable = function(){
            // Button Start available
            btn.prop('disabled', false);
            $('#available').show();
            $('#booked').hide();
        }
        this.onBooked = function(){
            $('#available').hide();
            $('#booked').show();
        }
    }};
}
