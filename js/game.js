define(['app'], function(app) {

    return {

        drawIntervalId: null,
        ballRadius: 9,
        paddlecolor: "#656565",
        ballcolor: "#f2665e",
        backcolor: "#f4f0ed",
        paddlePosition: {
            x: 0,
            y: 0
        },
        ballPosition: {
            x: 25,
            y: 250,
        },
        ballSpeed: {
            x: 1.5,
            y: -4,
        },
        // Used to calculate where the ball is going/what it's hitting
        tempBallPosition: {
            x: 0,
            y: 0,
        },

        init: function() {
            drawIntervalId = setInterval($.proxy(function() {
                this.draw();
            }, this), 10);
            app.init();
            app.initBricks();
        },

        addListeners: function() {
            $(window).on('game.over', function() {
                alert('Game over man, game over');
                clearInterval(drawIntervalId);
            });
        },

        draw: function() {
            app.ctx.fillStyle = this.backcolor;
            app.clear();
            app.ctx.fillStyle = this.ballcolor;
            app.circle(this.ballPosition.x, this.ballPosition.y, this.ballRadius);

            this.paddlePosition = {
                x: app.paddlex + app.PADDLE_POSITION_OFFSET.x,
                y: app.HEIGHT - app.paddleh + app.PADDLE_POSITION_OFFSET.y
            };

            this.tempBallPosition = {
                x: this.ballPosition.x + this.ballSpeed.x,
                y: this.ballPosition.y + this.ballSpeed.y
            };

            this.drawPaddle();
            app.drawBricks();
            this.updateBricks();

            if (this.isBallOutOfBounds()) {
                $(window).trigger('player.died');
                return this.restart();
            }

            // If the ball has hit the wall
            if (this.hasBallHitWall()) {
                this.ballSpeed.x *= -1;
            }

            if (this.isBallNearPaddle()) {
                // Ball has hit paddle
                if (this.hasBallHitPaddle()) {
                    //move the ball differently based on where it hit the paddle
                    this.ballSpeed.x = 8 * ((this.ballPosition.x - (app.paddlex + app.paddlew / 2)) / app.paddlew);
                    this.ballSpeed.y *= -1;
                } 
            } else if (this.hasBallHitTop()) {
                this.ballSpeed.y *= -1;
            }

            this.ballPosition = this.tempBallPosition;
        },

        restart: function() {
            this.ballPosition = {
                x: 25,
                y: 250,
            };
            this.ballSpeed = {
                x: 1.5,
                y: -4,
            };
        },

        updateBricks: function() {
            //want to learn about real collision detection? go read
            // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
            var rowheight = app.BRICKHEIGHT + app.PADDING;
            var colwidth = app.BRICKWIDTH + app.PADDING;
            var row = Math.floor(this.ballPosition.y / rowheight);
            var col = Math.floor(this.ballPosition.x / colwidth);
            //reverse the ball and mark the brick as broken
            if (this.ballPosition.y < app.NROWS * rowheight && row >= 0 && col >= 0 && app.bricks[row][col] == 1) {
                this.ballSpeed.y *= -1;
                app.bricks[row][col] = 0;
                $(window).trigger('brick.destroyed');
            }
        },

        drawPaddle: function() {

            // Move paddle
            if (app.rightDown) {
                paddlex += 5;
            } else if (app.leftDown) {
                paddlex -= 5;
            }
            app.ctx.fillStyle = this.paddlecolor;

            // Draw paddle
            app.rect(this.paddlePosition.x, this.paddlePosition.y, app.paddlew, app.paddleh);
        },

        hasBallHitWall: function() {
            return (this.tempBallPosition.x + this.ballRadius > app.WIDTH 
                    || this.tempBallPosition.x - this.ballRadius < 0);
        },

        hasBallHitTop: function() {
            return (this.ballPosition.y + this.ballSpeed.y - this.ballRadius < 0);
        },

        /**
         * Is the ball about to hit the paddle. Check whether the ball is currently hittable
         * or whether it's too late/early
         */
        isBallNearPaddle: function() {
            return (this.tempBallPosition.y + this.ballRadius >= app.HEIGHT - app.paddleh + app.PADDLE_POSITION_OFFSET.y);
        },

        hasBallHitPaddle: function() {
            return (this.ballPosition.x > this.paddlePosition.x && this.ballPosition.x < this.paddlePosition.x + app.paddlew);
        },

        isBallOutOfBounds: function() {
            return (this.tempBallPosition.y + this.ballRadius >= app.HEIGHT);
        }
    }
});
