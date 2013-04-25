define(['paddle', 'ball'], function(paddle, ball) {

    return {

        app: null,
        paddle: null,
        ball: null,
        ctx: null,
        ROW_COUNT: 3,
        MAX_ROW_COUNT: 8,
        COL_COUNT: 25,
        BRICKWIDTH: 0,
        BRICKHEIGHT: 18,
        PADDING: 2,
        bricks: [],
        drawIntervalId: null,
        DRAW_INTERVAL_DELAY: 1,
        addRowIntervalId: null,
        ADD_ROW_INTERVAL_DELAY: 5000,
        ballRadius: 9,
        rowColours: ["#57cbf5", "#6ac071", "#fcb040", "#f2665e"],
        paddleColour: "#656565",
        ballColour: "#725d3c",
        backColour: "#f4f0ed",
        paddleHeight: 13,
        paddleWidth: 110,
        paddlex: 0,
        destroyedRowsCount: 0,
        
        /**
         * Add a little more width to the paddle to make it easier to hit the
         * ball.
         *
         * Padding also give the illusion the side of the ball is hitting the
         * side of the paddle.
         */
        PADDLE_COLLISION_PADDING: 10,
        PADDLE_POSITION_OFFSET: {
            x: 0,
            y: -30
        },
        paddlePosition: {
            x: 0,
            y: 0
        },
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
        rowHeight: 0,
        colWidth: 0,
        nearestRow: 0,
        nearestCol: 0,
        rowCount: 0,

        init: function(app) {

            // App checks whether the browser supports <canvas> returning
            // false if it's not supported
            this.app = app;
            if (!this.app.isCanvasSupported()) return;
            this.app.init();

            this.ctx = this.app.ctx;

            this.ball = ball;
            this.ball.init(this.app);

            this.paddle = paddle;
            this.paddle.init(this.app);

            this.BRICKWIDTH = (this.app.WIDTH / this.COL_COUNT) - this.PADDING;
            this.initPaddle();
            this.initBricks();
            this.startDrawInterval();
            this.startAddRowInterval();
            this.addListeners();
        },

        reset: function() {
            this.bricks = [];
            this.initBricks();
            this.startDrawInterval();
        },

        addListeners: function() {
            $(window).on('game.over', $.proxy(function() {
                clearInterval(this.drawIntervalId);
            }, this));

            $(window).on('game.reset', $.proxy(function() {
                this.reset();
            }, this));

            /*
            $(window).on('mouse.moved', $.proxy(function(e, x, y) {
                this.paddlex = Math.max(x - this.app.canvasMinX - (this.paddleWidth / 2), 0);
                this.paddlex = Math.min(this.app.WIDTH - this.paddleWidth, this.paddlex);
            }, this));
            */
        },

        startDrawInterval: function() {
            this.drawIntervalId = window.setInterval($.proxy(function() {
                this.draw();
            }, this), this.DRAW_INTERVAL_DELAY);
        },

        draw: function() {
            this.ctx.fillStyle = this.backColour;
            this.clear();

            this.paddlePosition = {
                x: this.paddlex + this.PADDLE_POSITION_OFFSET.x,
                y: this.app.HEIGHT - this.paddleHeight + this.PADDLE_POSITION_OFFSET.y
            };

            this.paddle.draw();
            if (this.isBallNearPaddle()) {
                // Ball has hit paddle
                if (this.hasBallHitPaddle()) {
                    //move the ball differently based on where it hit the paddle
                    this.ball.ballSpeed.x = 8 * ((this.ball.ballPosition.x - (this.paddle.paddlex + this.paddle.paddleWidth / 2)) / this.paddle.paddleWidth);
                    this.ball.ballSpeed.y *= -1;
                } 
            } else if (this.hasBallHitTop()) {
                this.ball.ballSpeed.y *= -1;
            }

            this.ball.draw();
            this.updateBricks();
            this.drawBricks();

            /*
            this.tempBallPosition = {
                x: this.ballPosition.x + this.ballSpeed.x,
                y: this.ballPosition.y + this.ballSpeed.y
            };

            this.drawBall();
            this.drawPaddle();
            this.updateBricks();
            this.drawBricks();

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
            */
        },

        restart: function() {
            this.ballPosition = {
                x: 25,
                y: 250,
            };
            this.ballSpeed = {
                x: 1.6,
                y: -2,
            };
        },

        initPaddle: function() {
            this.paddlex = (this.app.WIDTH - this.paddleWidth) / 2;
        },

        initBricks: function() {
            for(var i=0; i < this.ROW_COUNT; i++) {
                this.addRow();
            }
        },

        addRow: function() {
            // Prepend row
            this.bricks.unshift(this.createRow());
        },

        createRow: function() {
            var row = [];
            for(var i=0; i < this.COL_COUNT; i++) {
                row[i] = 1;
            }
            return row;
        },

        startAddRowInterval: function() {
            this.addRowIntervalId = setInterval($.proxy(function() {
                if (this.rowCount < this.MAX_ROW_COUNT) {
                    this.addRow();
                }
            }, this), this.ADD_ROW_INTERVAL_DELAY);
        },

        drawBricks: function() {
            this.updateBrickDimensions();
            for(var i=0; i < this.rowCount; i++) {
                var row = this.bricks[i];

                // Keeping track of destroyed rows ensures that row colours
                // don't get changed as we remove rows from the bricks array
                var index = this.rowCount - i + this.destroyedRowsCount;
                var colourIndex = (index >= this.rowColours.length) ? index % this.rowColours.length : index;
                this.ctx.fillStyle = this.rowColours[colourIndex];

                var colCount = row.length;
                for(var j=0; j < colCount; j++) {
                    if (row[j] == 1) {
                        this.drawBrickForRowAndColumn(i, j);
                    }
                }
            }
        },

        drawBrickForRowAndColumn: function(row, column) {
            var x = (column * (this.BRICKWIDTH + this.PADDING)) + this.PADDING;
            var y = (row * (this.BRICKHEIGHT + this.PADDING)) + this.PADDING;
            this.rect(x, y, this.BRICKWIDTH, this.BRICKHEIGHT);
        },

        updateBricks: function() {
            this.updateBrickDimensions();
            //reverse the ball and mark the brick as broken
            if (this.hasBallHitNearestBrick()) {
                this.ball.ballSpeed.y *= -1;
                this.bricks[this.nearestRow][this.nearestCol] = 0;
                if (!this.isLastRowActive()) {
                    this.removeLastRow();
                }
                $(window).trigger('brick.destroyed');
            }
        },

        updateBrickDimensions: function() {
            this.rowHeight = this.BRICKHEIGHT + this.PADDING;
            this.colWidth = this.BRICKWIDTH + this.PADDING;
            this.nearestRow = Math.floor(this.ball.ballPosition.y / this.rowHeight);
            this.nearestCol = Math.floor(this.ball.ballPosition.x / this.colWidth);
            this.rowCount = this.bricks.length;
            this.bricksHeight = this.rowCount * this.rowHeight;
        },

        isLastRowActive: function() {
            var isRowActive = false;

            var lastRow = this.bricks[this.rowCount - 1];
            for (var i=0; i < this.COL_COUNT; i++) {
                var col = lastRow[i];
                if (col == 1) {
                    isRowActive = true;
                    break;
                }
            };

            return isRowActive;
        },

        removeLastRow: function() {
            this.bricks.splice(this.rowCount - 1, 1);
            this.destroyedRowsCount++;
        },

        drawBall: function() {
            this.ctx.fillStyle = this.ballColour;
            this.circle(this.ballPosition.x, this.ballPosition.y, this.ballRadius);
        },

        drawPaddle: function() {

            // Move paddle
            if (this.app.rightDown && this.canPaddleMoveRight()) {
                this.paddlex += 5;
            } else if (this.app.leftDown && this.canPaddleMoveLeft()) {
                this.paddlex -= 5;
            }
            this.ctx.fillStyle = this.paddleColour;
            this.rect(this.paddlePosition.x, this.paddlePosition.y, this.paddleWidth, this.paddleHeight);
        },

        canPaddleMoveLeft: function() {
            return (this.paddlePosition.x > 0);
        },

        canPaddleMoveRight: function() {
            return (this.paddlePosition.x + this.paddleWidth < this.app.WIDTH);
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
            return (this.ball.ballPosition.y < this.bricksHeight);
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
            var bottomOfBall = this.ball.tempBallPosition.y + this.ball.ballRadius;
            var topOfPaddle = this.app.HEIGHT - this.paddle.paddleHeight + this.paddle.PADDLE_POSITION_OFFSET.y;
            return (bottomOfBall >= topOfPaddle && !this.isBallInGutter());
        },

        /**
         * This gutter is the area below the paddle when the ball is still
         * technically in play but cannot be hit.
         */
        isBallInGutter: function() {
            var gutterHeight = this.app.HEIGHT + this.paddle.PADDLE_POSITION_OFFSET.y;
            var bottomOfBall = this.ball.tempBallPosition.y + this.ball.ballRadius;
            return (bottomOfBall >= gutterHeight);
        },

        hasBallHitPaddle: function() {
            return (this.ball.isBallMovingDown() 
                && this.ball.ballPosition.x >= this.paddle.paddlePosition.x - this.paddle.PADDLE_COLLISION_PADDING
                && this.ball.ballPosition.x <= this.paddle.paddlePosition.x + this.paddle.paddleWidth + this.paddle.PADDLE_COLLISION_PADDING);
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

        rect: function(x,y,w,h) {
            this.ctx.beginPath();
            this.ctx.rect(x, y, w, h);
            this.ctx.closePath();
            this.ctx.fill();
        },

        clear: function() {
            this.ctx.clearRect(0, 0, this.app.WIDTH, this.app.HEIGHT);
            this.rect(0, 0, this.app.WIDTH, this.app.HEIGHT);
        }
    }
});
