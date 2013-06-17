define(['jquery', 'paddle', 'ball', 'game'], function($, paddle, ball, game) {

    'use strict';

    var configHandler = {

        $paddleWidth: null,
        $ballRadius: null,
        $ballSpeed: null,
        $canvas: null,

        init: function() {
            this.$paddleWidth = $('#paddle-width');
            this.$ballRadius = $('#ball-radius');
            this.$ballSpeed = $('#ball-speed');
            this.$canvas = $('#canvas');

            this.addListeners();
            this.updateDefaultValues();
        },

        updateDefaultValues: function() {
            this.$paddleWidth.val(paddle.width);
            this.$ballRadius.val(ball.radius);
            this.$ballSpeed.val(Math.abs(ball.velocity.x));
        },

        addListeners: function() {
            this.$paddleWidth.on('change', function(e) {
                paddle.width = $(this).val();
            });

            this.$ballRadius.on('change', function(e) {
                ball.radius = +$(this).val();
            });

            this.$ballSpeed.on('change', function(e) {
                var newVelocity = {
                    x: +$(this).val(),
                    y: $(this).val() * -1
                };

                /**
                 * Prevent changing the ball speed from unpausing the game
                 * Updated the saved velocity value if paused so game resumes with
                 * new velocity.
                 */
                if (game.isPaused) {
                    ball.savedVelocity = newVelocity;
                } else {
                    ball.velocity = newVelocity;
                }
            });

            this.$canvas.on('click', function(e) {
                game.pause();
            });
        }
    }

    return configHandler;
});
