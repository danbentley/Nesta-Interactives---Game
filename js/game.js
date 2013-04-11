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
// Used to calculate where the ball is going/what it's hitting
var tempBallPosition = {
    x: 1.5,
    y: -4,
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

    drawPaddle();
    drawbricks();
    updateBricks();

    // If the ball has hit the wall
    if (hasBallHitWall()) {
        tempBallPosition.x = -tempBallPosition.x;
    }

    if (hasBallHitTop()) {
        tempBallPosition.y = -tempBallPosition.y;
    } else if (ballPosition.y + tempBallPosition.y + ballRadius > HEIGHT - paddleh + PADDLE_POSITION_OFFSET.y) {
        // Ball has hit paddle
        if (ballPosition.x > paddlePosition.x && ballPosition.x < paddlePosition.y) {
            //move the ball differently based on where it hit the paddle
            tempBallPosition.x = 8 * ((ballPosition.x-(paddlex+paddlew/2))/paddlew);
            tempBallPosition.y = -tempBallPosition.y;
        } else if (isBallOutOfBounds()) {
            clearInterval(intervalId);
        }
    }

    ballPosition.x += tempBallPosition.x;
    ballPosition.y += tempBallPosition.y;
}

function updateBricks() {
    //want to learn about real collision detection? go read
    // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
    rowheight = BRICKHEIGHT + PADDING;
    colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(ballPosition.y/rowheight);
    col = Math.floor(ballPosition.x/colwidth);
    //reverse the ball and mark the brick as broken
    if (ballPosition.y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
        tempBallPosition.y = -tempBallPosition.y;
        bricks[row][col] = 0;
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
    return (ballPosition.x + tempBallPosition.x + ballRadius > WIDTH 
            || ballPosition.x + tempBallPosition.x - ballRadius < 0);
}

function hasBallHitTop() {
    return (ballPosition.y + tempBallPosition.y - ballRadius < 0);
}

function isBallOutOfBounds() {
    return (ballPosition.y + tempBallPosition.y + ballRadius > HEIGHT);
}

init();
initbricks();
