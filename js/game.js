define(['app'], function() {

    return {

        app: null,
        ctx: null,
        ROW_COUNT: 5,
        MAX_ROW_COUNT: 7,
        COL_COUNT: 27,
        BRICKWIDTH: 0,
        BRICKHEIGHT: 18,
        PADDING: 2,
        bricks: [],
        drawIntervalId: null,
        addRowIntervalId: null,
        ballRadius: 9,
        rowcolors: ["#f2665e", "#fcb040", "#6ac071", "#57cbf5", "#f2665e"],
        paddlecolor: "#656565",
        ballcolor: "#f2665e",
        backcolor: "#f4f0ed",
        paddleh: 13,
        paddlew: 110,
        paddlex: 0,
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
            this.app.init();
            this.ctx = this.app.ctx;
            this.drawIntervalId = setInterval($.proxy(function() {
                this.draw();
            }, this), 10);
            this.BRICKWIDTH = (this.app.WIDTH / this.COL_COUNT) - 1;
            this.initPaddle();
            this.initBricks();
            this.startAddRowInterval();
            this.addListeners();
        },

        addListeners: function() {
            $(window).on('game.over', $.proxy(function() {
                clearInterval(this.drawIntervalId);
            }, this));

            $(window).on('mouse.moved', $.proxy(function(e, x, y) {
                this.paddlex = Math.max(x - this.app.canvasMinX - (this.paddlew / 2), 0);
                this.paddlex = Math.min(this.app.WIDTH - this.paddlew, this.paddlex);
            }, this));
        },

        draw: function() {
            this.ctx.fillStyle = this.backcolor;
            this.clear();

            this.paddlePosition = {
                x: this.paddlex + this.PADDLE_POSITION_OFFSET.x,
                y: this.app.HEIGHT - this.paddleh + this.PADDLE_POSITION_OFFSET.y
            };

            this.tempBallPosition = {
                x: this.ballPosition.x + this.ballSpeed.x,
                y: this.ballPosition.y + this.ballSpeed.y
            };

            this.drawBall();
            this.drawPaddle();
            this.drawBricks();
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
                    this.ballSpeed.x = 8 * ((this.ballPosition.x - (this.paddlex + this.paddlew / 2)) / this.paddlew);
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

        initPaddle: function() {
            this.paddlex = (this.app.WIDTH - this.paddlew) / 2;
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
                if (this.bricks.length < this.MAX_ROW_COUNT) {
                    this.addRow();
                }
            }, this), 5000);
        },

        drawBricks: function() {
            var rowCount = this.bricks.length;
            for(var i=0; i < rowCount; i++) {
                var row = this.bricks[i];

                this.ctx.fillStyle = this.rowcolors[i];

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
            //want to learn about real collision detection? go read
            // http://www.harveycartel.org/metanet/tutorials/tutorialA.html
            var rowheight = this.BRICKHEIGHT + this.PADDING;
            var colwidth = this.BRICKWIDTH + this.PADDING;
            var row = Math.floor(this.ballPosition.y / rowheight);
            var col = Math.floor(this.ballPosition.x / colwidth);
            var rowCount = this.bricks.length
            //reverse the ball and mark the brick as broken
            if (this.ballPosition.y < rowCount * rowheight && row >= 0 && col >= 0 && this.bricks[row][col] == 1) {
                this.ballSpeed.y *= -1;
                this.bricks[row][col] = 0;
                if (!this.isRowActive(this.bricks[row])) {
                    this.bricks.splice(row, 1);
                }
                $(window).trigger('brick.destroyed');
            }
        },

        isRowActive: function(row) {
            var isRowActive = false;
            var rowLength = row.length;
            for (var i=0; i < rowLength; i++) {
                var col = row[i];
                if (col == 1) {
                    isRowActive = true;
                    break;
                }
            };

            return isRowActive;
        },

        drawBall: function() {
            this.ctx.fillStyle = this.ballcolor;
            this.circle(this.ballPosition.x, this.ballPosition.y, this.ballRadius);
        },

        drawPaddle: function() {

            // Move paddle
            if (this.app.rightDown && this.canPaddleMoveRight()) {
                this.paddlex += 5;
            } else if (this.app.leftDown && this.canPaddleMoveLeft()) {
                this.paddlex -= 5;
            }
            this.ctx.fillStyle = this.paddlecolor;
            this.rect(this.paddlePosition.x, this.paddlePosition.y, this.paddlew, this.paddleh);
        },

        canPaddleMoveLeft: function() {
            return (this.paddlePosition.x > 0);
        },

        canPaddleMoveRight: function() {
            return (this.paddlePosition.x + this.paddlew < this.app.WIDTH);
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
            return (this.tempBallPosition.y + this.ballRadius >= this.app.HEIGHT - this.paddleh + this.PADDLE_POSITION_OFFSET.y);
        },

        hasBallHitPaddle: function() {
            return (this.ballPosition.x > this.paddlePosition.x && this.ballPosition.x < this.paddlePosition.x + this.paddlew);
        },

        isBallOutOfBounds: function() {
            return (this.tempBallPosition.y + this.ballRadius >= this.app.HEIGHT);
        },

        circle: function(x,y,r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
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
