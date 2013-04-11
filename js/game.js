var ballRadius = 9;
var rowcolors = ["#f2665e", "#fcb040", "#6ac071", "#57cbf5", "#f2665e"];
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

function draw() {
    ctx.fillStyle = backcolor;
    clear();
    ctx.fillStyle = ballcolor;
    circle(ballPosition.x, ballPosition.y, ballRadius);

    paddlePosition = {
        x: paddlex + PADDLE_POSITION_OFFSET.x,
        y: HEIGHT - paddleh + PADDLE_POSITION_OFFSET.y
    };

    tempBallPosition = {
        x: ballPosition.x + ballSpeed.x,
        y: ballPosition.y + ballSpeed.y
    };

    drawPaddle();
    drawbricks();
    updateBricks();

    if (isBallOutOfBounds()) {
        clearInterval(intervalId);
    }

    // If the ball has hit the wall
    if (hasBallHitWall()) {
        ballSpeed.x *= -1;
    }

    if (isBallNearPaddle()) {
        // Ball has hit paddle
        if (hasBallHitPaddle()) {
            //move the ball differently based on where it hit the paddle
            ballSpeed.x = 8 * ((ballPosition.x - (paddlex + paddlew / 2)) / paddlew);
            ballSpeed.y *= -1;
        } 
    } else if (hasBallHitTop()) {
        ballSpeed.y *= -1;
    }

    ballPosition = tempBallPosition;
}

function updateBricks() {
    //want to learn about real collision detection? go read
    // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
    rowheight = BRICKHEIGHT + PADDING;
    colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(ballPosition.y / rowheight);
    col = Math.floor(ballPosition.x / colwidth);
    //reverse the ball and mark the brick as broken
    if (ballPosition.y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
        ballSpeed.y *= -1;
        bricks[row][col] = 0;
        $(window).trigger('brick.destroyed');
    }
}

function drawPaddle() {

    // Move paddle
    if (rightDown) {
        paddlex += 5;
    } else if (leftDown) {
        paddlex -= 5;
    }
    ctx.fillStyle = paddlecolor;

    // Draw paddle
    rect(paddlePosition.x, paddlePosition.y, paddlew, paddleh);
}

function hasBallHitWall() {
    return (tempBallPosition.x + ballRadius > WIDTH 
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
    return (tempBallPosition.y + ballRadius >= HEIGHT - paddleh + PADDLE_POSITION_OFFSET.y);
}

function hasBallHitPaddle() {
    return (ballPosition.x > paddlePosition.x && ballPosition.x < paddlePosition.x + paddlew);
}

function isBallOutOfBounds() {
    return (tempBallPosition.y + ballRadius >= HEIGHT);
}

init();
initbricks();
