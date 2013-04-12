define(['app'], function(app) {

    var drawIntervalId = null;
    var ballRadius = 9;
    var paddlecolor = "#656565";
    var ballcolor = "#f2665e";
    var backcolor = "#f4f0ed";
    var paddlePosition = {
        x: 0,
        y: 0
    };
    var ballPosition = {
        x: 25,
        y: 250,
    }
    var ballSpeed = {
        x: 1.5,
        y: -4,
    }
    // Used to calculate where the ball is going/what it's hitting
    var tempBallPosition = {
        x: 0,
        y: 0,
    }

    $(window).on('game.over', function() {
        alert('Game over man, game over');
        clearInterval(drawIntervalId);
    });

    function init() {
        drawIntervalId = setInterval(function() {
            draw();
        }, 10);
        app.init();
        app.initBricks();
    }

    function draw() {
        app.ctx.fillStyle = backcolor;
        app.clear();
        app.ctx.fillStyle = ballcolor;
        app.circle(ballPosition.x, ballPosition.y, ballRadius);

        paddlePosition = {
            x: app.paddlex + app.PADDLE_POSITION_OFFSET.x,
            y: app.HEIGHT - app.paddleh + app.PADDLE_POSITION_OFFSET.y
        };

        tempBallPosition = {
            x: ballPosition.x + ballSpeed.x,
            y: ballPosition.y + ballSpeed.y
        };

        drawPaddle();
        app.drawBricks();
        updateBricks();

        if (isBallOutOfBounds()) {
            $(window).trigger('player.died');
            return restart();
        }

        // If the ball has hit the wall
        if (hasBallHitWall()) {
            ballSpeed.x *= -1;
        }

        if (isBallNearPaddle()) {
            // Ball has hit paddle
            if (hasBallHitPaddle()) {
                //move the ball differently based on where it hit the paddle
                ballSpeed.x = 8 * ((ballPosition.x - (app.paddlex + app.paddlew / 2)) / app.paddlew);
                ballSpeed.y *= -1;
            } 
        } else if (hasBallHitTop()) {
            ballSpeed.y *= -1;
        }

        ballPosition = tempBallPosition;
    }

    function restart() {
        ballPosition = {
            x: 25,
            y: 250,
        };
        ballSpeed = {
            x: 1.5,
            y: -4,
        };
    }

    function updateBricks() {
        //want to learn about real collision detection? go read
        // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
        rowheight = app.BRICKHEIGHT + app.PADDING;
        colwidth = app.BRICKWIDTH + app.PADDING;
        row = Math.floor(ballPosition.y / rowheight);
        col = Math.floor(ballPosition.x / colwidth);
        //reverse the ball and mark the brick as broken
        if (ballPosition.y < app.NROWS * rowheight && row >= 0 && col >= 0 && app.bricks[row][col] == 1) {
            ballSpeed.y *= -1;
            app.bricks[row][col] = 0;
            $(window).trigger('brick.destroyed');
        }
    }

    function drawPaddle() {

        // Move paddle
        if (app.rightDown) {
            paddlex += 5;
        } else if (app.leftDown) {
            paddlex -= 5;
        }
        app.ctx.fillStyle = paddlecolor;

        // Draw paddle
        app.rect(paddlePosition.x, paddlePosition.y, app.paddlew, app.paddleh);
    }

    function hasBallHitWall() {
        return (tempBallPosition.x + ballRadius > app.WIDTH 
                || tempBallPosition.x - ballRadius < 0);
    }

    function hasBallHitTop() {
        return (ballPosition.y + ballSpeed.y - ballRadius < 0);
    }

    /**
     * Is the ball about to hit the paddle. Check whether the ball is currently hittable
     * or whether it's too late/early
     */
    function isBallNearPaddle() {
        return (tempBallPosition.y + ballRadius >= app.HEIGHT - app.paddleh + app.PADDLE_POSITION_OFFSET.y);
    }

    function hasBallHitPaddle() {
        return (ballPosition.x > paddlePosition.x && ballPosition.x < paddlePosition.x + app.paddlew);
    }

    function isBallOutOfBounds() {
        return (tempBallPosition.y + ballRadius >= app.HEIGHT);
    }

    init();
});
