define(['jquery', 'paddle', 'ball', 'game'], function($, paddle, ball, game) {

    $(document).ready(function() {
        $('#paddle-width').on('change', function(e) {
            paddle.width = $(this).val();
        });

        $('#ball-radius').on('change', function(e) {
            ball.radius = $(this).val() / 10;
        });

        $('#ball-speed').on('change', function(e) {
            ball.velocity = {
                x: +$(this).val(),
                y: $(this).val() * -1
            };
            console.log(ball);
        });

        $('#canvas').on('click', function(e) {
            game.pause();
        });
    });
});
