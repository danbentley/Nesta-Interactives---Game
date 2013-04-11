var ballr = 10;
var rowcolors = ["#f2665e", "#fcb040", "#6ac071", "#57cbf5", "#f2665e"];
var paddlecolor = "#656565";
var ballcolor = "#f2665e";
var backcolor = "#f4f0ed";
var paddlePosition = {
    x: 0,
    y: 0
};

function draw() {
    ctx.fillStyle = backcolor;
    clear();
    ctx.fillStyle = ballcolor;
    circle(x, y, ballr);

    paddlePosition = {
        x: paddlex + PADDLE_POSITION_OFFSET.x,
        y: HEIGHT - paddleh + PADDLE_POSITION_OFFSET.y
    };

    drawPaddle();
    drawbricks();

    //want to learn about real collision detection? go read
    // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
    rowheight = BRICKHEIGHT + PADDING;
    colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(y/rowheight);
    col = Math.floor(x/colwidth);
    //reverse the ball and mark the brick as broken
    if (y < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
        dy = -dy;
        bricks[row][col] = 0;
    }

    if (x + dx + ballr > WIDTH || x + dx - ballr < 0)
        dx = -dx;

    if (y + dy - ballr < 0)
        dy = -dy;
    else if (y + dy + ballr > HEIGHT - paddleh + PADDLE_POSITION_OFFSET.y) {
        // Ball has hit paddle
        if (x > paddlePosition.x && x < paddlePosition.y) {
            //move the ball differently based on where it hit the paddle
            dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
            dy = -dy;
        }
        else if (y + dy + ballr > HEIGHT)
            clearInterval(intervalId);
    }

    x += dx;
    y += dy;
}

function drawPaddle() {

    // Move paddle
    if (rightDown) paddlex += 5;
    else if (leftDown) paddlex -= 5;
    ctx.fillStyle = paddlecolor;

    // Draw paddle
    rect(paddlePosition.x, paddlePosition.y, paddlew, paddleh);
}

init();
initbricks();
