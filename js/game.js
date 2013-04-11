var ballr = 10;
var rowcolors = ["#FF1C0A", "#FFFD0A", "#00A308", "#0008DB", "#EB0093"];
var paddlecolor = "#FFFFFF";
var ballcolor = "#FFFFFF";
var backcolor = "#000000";
 
function draw() {
  ctx.fillStyle = backcolor;
  clear();
  ctx.fillStyle = ballcolor;
  circle(x, y, ballr);

  var paddlePosition = {
    x: paddlex + PADDLE_POSITION_OFFSET.x,
    y: HEIGHT - paddleh + PADDLE_POSITION_OFFSET.y
  };
 
  if (rightDown) paddlex += 5;
  else if (leftDown) paddlex -= 5;
  ctx.fillStyle = paddlecolor;

  // Draw paddle
  rect(paddlePosition.x, paddlePosition.y, paddlew, paddleh);
 
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
 
init();
initbricks();
