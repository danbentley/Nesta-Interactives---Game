define(['jquery', 'paddle', 'ball', 'game'], function($, paddle, ball, game) {

    'use strict';

    var configHandler = {

        init: function() {
            this.addListeners();
        },

        addListeners: function() {
            $('#paddle-width').on('change', function(e) {
                paddle.width = $(this).val();
            });

            $('#ball-radius').on('change', function(e) {
                ball.radius = $(this).val() / 10;
            });

            $('#ball-speed').on('change', function(e) {
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

            $('#canvas').on('click', function(e) {
                game.pause();
            });
        }
    }

    return configHandler;
});
