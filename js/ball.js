define([], function() {

    return {

        app: null,
        ctx: null,
        ballRadius: 9,
        ballColour: "#725d3c",
        ballPosition: {
            x: 25,
            y: 250,
        },
        ballSpeed: {
            x: 1.6,
            y: -2,
        },
        // Used to calculate where the ball is going/what it's hitting
        tempBallPosition: {
            x: 0,
            y: 0,
        },

        init: function(app) {
            this.app = app;
            this.ctx = this.app.ctx;
        },

        hasBallHitWall: function() {
            return (this.hasBallHitLeftWall() || this.hasBallHitRightWall());
        },

        hasBallHitLeftWall: function() {
            return (this.tempBallPosition.x - this.ballRadius <= 0);
        },

        hasBallHitRightWall: function() {
            return (this.tempBallPosition.x + this.ballRadius >= this.app.WIDTH);
        },

        hasBallHitTop: function() {
            return (this.ballPosition.y + this.ballSpeed.y - this.ballRadius < 0);
        },

        /**
         * Is the ball close enough to hit any bricks
         *
         */
        isBallNearBricks: function() {
            return (this.ballPosition.y < this.bricksHeight);
        },

        isBallWithinCollisionArea: function() {
            return (this.nearestRow >= 0 && this.nearestCol >= 0);
        },

        isBrickActive: function(row, col) {
            return (this.bricks[row][col] === 1);
        },

        isBrickNearestBallActive: function() {
            return this.isBrickActive(this.nearestRow, this.nearestCol);
        },

        hasBallHitNearestBrick: function() {
            return (this.isBallNearBricks()
                && this.isBallWithinCollisionArea()
                && this.isBrickNearestBallActive());
        },

        /**
         * Is the ball about to hit the paddle. Check whether the ball is currently hittable
         * or whether it's too late/early
         */
        isBallNearPaddle: function() {

            return false;

            var bottomOfBall = this.tempBallPosition.y + this.ballRadius;
            var topOfPaddle = this.app.HEIGHT - this.paddleHeight + this.PADDLE_POSITION_OFFSET.y;
            return (bottomOfBall >= topOfPaddle && !this.isBallInGutter());
        },

        /**
         * This gutter is the area below the paddle when the ball is still
         * technically in play but cannot be hit.
         */
        isBallInGutter: function() {
            var gutterHeight = this.app.HEIGHT + this.PADDLE_POSITION_OFFSET.y;
            var bottomOfBall = this.tempBallPosition.y + this.ballRadius;
            return (bottomOfBall >= gutterHeight);
        },

        hasBallHitPaddle: function() {
            return (this.isBallMovingDown() 
                && this.ballPosition.x >= this.paddlePosition.x - this.PADDLE_COLLISION_PADDING
                && this.ballPosition.x <= this.paddlePosition.x + this.paddleWidth + this.PADDLE_COLLISION_PADDING);
        },

        isBallMovingDown: function() {
            return (this.ballSpeed.y > 0);
        },

        isBallOutOfBounds: function() {
            /**
             * Subtract the ball radius from the position so the ball is
             * completely out of site before we declare it out of bounds.
             */
            return (this.tempBallPosition.y - this.ballRadius > this.app.HEIGHT);
        },

        correctBallPlacementAfterHittingWall: function() {
            this.tempBallPosition.x = (this.hasBallHitLeftWall()) ? this.ballRadius : this.app.WIDTH - this.ballRadius;
        },

        drawBall: function() {
            this.ctx.fillStyle = this.ballColour;
            this.circle(this.ballPosition.x, this.ballPosition.y, this.ballRadius);
        },

        draw: function() {
            this.tempBallPosition = {
                x: this.ballPosition.x + this.ballSpeed.x,
                y: this.ballPosition.y + this.ballSpeed.y
            };

            this.drawBall();

            if (this.isBallOutOfBounds()) {
                $(window).trigger('player.died');
                return this.restart();
            }

            // If the ball has hit the wall
            if (this.hasBallHitWall()) {
                this.correctBallPlacementAfterHittingWall();
                this.ballSpeed.x *= -1;
            }

            if (this.isBallNearPaddle()) {
                // Ball has hit paddle
                if (this.hasBallHitPaddle()) {
                    //move the ball differently based on where it hit the paddle
                    this.ballSpeed.x = 8 * ((this.ballPosition.x - (this.paddlex + this.paddleWidth / 2)) / this.paddleWidth);
                    this.ballSpeed.y *= -1;
                } 
            } else if (this.hasBallHitTop()) {
                this.ballSpeed.y *= -1;
            }

            this.ballPosition = this.tempBallPosition;
        },

        circle: function(x,y,r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
        },

    };
});
