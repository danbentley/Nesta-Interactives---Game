define(['app'], function() {

    return {

        app: null,
        drawIntervalId: null,
        ballRadius: 9,
        paddlecolor: "#656565",
        ballcolor: "#f2665e",
        backcolor: "#f4f0ed",
        $game: $('.game'),
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

        init: function(app) {
            this.app = app;
            this.drawIntervalId = setInterval($.proxy(function() {
                this.draw();
            }, this), 10);
            this.app.init();
            this.app.initBricks();
            this.addListeners();
        },

        addListeners: function() {
            $(window).on('game.over', $.proxy(function() {
                this.$game.addClass('complete');
                clearInterval(this.drawIntervalId);
            }, this));
        },

        draw: function() {
            this.app.ctx.fillStyle = this.backcolor;
            this.app.clear();
            this.app.ctx.fillStyle = this.ballcolor;
            this.app.circle(this.ballPosition.x, this.ballPosition.y, this.ballRadius);

            this.paddlePosition = {
                x: this.app.paddlex + this.app.PADDLE_POSITION_OFFSET.x,
                y: this.app.HEIGHT - this.app.paddleh + this.app.PADDLE_POSITION_OFFSET.y
            };

            this.tempBallPosition = {
                x: this.ballPosition.x + this.ballSpeed.x,
                y: this.ballPosition.y + this.ballSpeed.y
            };

            this.drawPaddle();
            this.app.drawBricks();
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
                    this.ballSpeed.x = 8 * ((this.ballPosition.x - (this.app.paddlex + this.app.paddlew / 2)) / this.app.paddlew);
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
            var rowheight = this.app.BRICKHEIGHT + this.app.PADDING;
            var colwidth = this.app.BRICKWIDTH + this.app.PADDING;
            var row = Math.floor(this.ballPosition.y / rowheight);
            var col = Math.floor(this.ballPosition.x / colwidth);
            //reverse the ball and mark the brick as broken
            if (this.ballPosition.y < this.app.NROWS * rowheight && row >= 0 && col >= 0 && this.app.bricks[row][col] == 1) {
                this.ballSpeed.y *= -1;
                this.app.bricks[row][col] = 0;
                $(window).trigger('brick.destroyed');
            }
        },

        drawPaddle: function() {

            // Move paddle
            if (this.app.rightDown && this.canPaddleMoveRight()) {
                this.app.paddlex += 5;
            } else if (this.app.leftDown && this.canPaddleMoveLeft()) {
                this.app.paddlex -= 5;
            }
            this.app.ctx.fillStyle = this.paddlecolor;

            // Draw paddle
            this.app.rect(this.paddlePosition.x, this.paddlePosition.y, this.app.paddlew, this.app.paddleh);
        },

        canPaddleMoveLeft: function() {
            return (this.paddlePosition.x > 0);
        },

        canPaddleMoveRight: function() {
            return (this.paddlePosition.x + this.app.paddlew < this.app.WIDTH);
        },

        hasBallHitWall: function() {
            return (this.tempBallPosition.x + this.ballRadius > this.app.WIDTH 
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
            return (this.tempBallPosition.y + this.ballRadius >= this.app.HEIGHT - this.app.paddleh + this.app.PADDLE_POSITION_OFFSET.y);
        },

        hasBallHitPaddle: function() {
            return (this.ballPosition.x > this.paddlePosition.x && this.ballPosition.x < this.paddlePosition.x + this.app.paddlew);
        },

        isBallOutOfBounds: function() {
            return (this.tempBallPosition.y + this.ballRadius >= this.app.HEIGHT);
        }
    }
});
