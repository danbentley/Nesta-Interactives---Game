define([], function() {

    return {

        x: 25,
        y: 250,
        dx: 1.5,
        dy: -4,
        ctx: null,
        WIDTH: 0,
        HEIGHT: 0,
        PADDLE_POSITION_OFFSET: {
            x: 0,
            y: -30
        },
        paddlex: 0,
        paddleh: 13,
        paddlew: 110,
        rightDown: false,
        leftDown: false,
        canvasMinX: 0,
        canvasMaxX: 0,
        bricks: [],
        NROWS: 5,
        NCOLS: 27,
        BRICKWIDTH: 0,
        BRICKHEIGHT: 18,
        PADDING: 1,
        POINTS_PER_BRICK: 30,
        score: 0,
        $currentScore: $('#current-score'),
        $currentLives: $('#lives'),
        rowcolors: ["#f2665e", "#fcb040", "#6ac071", "#57cbf5", "#f2665e"],
        currentLives: 3,

        init: function() {
            this.ctx = $('#canvas')[0].getContext("2d");
            this.WIDTH = $("#canvas").width();
            this.HEIGHT = $("#canvas").height();
            this.paddlex = (this.WIDTH - this.paddlew) / 2;
            this.BRICKWIDTH = (this.WIDTH / this.NCOLS) - 1;
            this.canvasMinX = $("#canvas").offset().left;
            this.canvasMaxX = this.canvasMinX + this.WIDTH;
            this.updateLives();
            this.addListeners();
        },

        addListeners: function() {
            $(window).on('brick.destroyed', $.proxy(function() {
                this.score += this.POINTS_PER_BRICK;
                this.$currentScore.find('strong').html(this.score);
            }, this));

            $(window).on('player.died', $.proxy(function() {
                this.currentLives--;
                this.updateLives();
                if (this.currentLives === 0) {
                    $(window).trigger('game.over');
                } else {
                    restart();
                }
            }, this));

            $(document).keydown($.proxy(function(e) {
                if (e.keyCode == 39) {
                    this.rightDown = true;
                } else if (e.keyCode == 37) {
                    this.leftDown = true;
                }
            }, this));

            $(document).keyup($.proxy(function(e) {
                if (e.keyCode == 39) {
                    this.rightDown = false;
                } else if (e.keyCode == 37) {
                    this.leftDown = false;
                }
            }, this));

            $(document).mousemove($.proxy(function(e) {
                if (e.pageX > this.canvasMinX && e.pageX < this.canvasMaxX) {
                    this.paddlex = Math.max(e.pageX - this.canvasMinX - (this.paddlew / 2), 0);
                    this.paddlex = Math.min(this.WIDTH - this.paddlew, this.paddlex);
                }
            }, this));
        },

        updateLives: function() {
            this.$currentLives.find('strong').html(this.currentLives);
        },

        circle: function(x,y,r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI*2, true);
            this.ctx.closePath();
            this.ctx.fill();
        },

        rect: function(x,y,w,h) {
            this.ctx.beginPath();
            this.ctx.rect(x,y,w,h);
            this.ctx.closePath();
            this.ctx.fill();
        },

        clear: function() {
            this.ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            this.rect(0, 0, this.WIDTH, this.HEIGHT);
        },

        initBricks: function() {
            this.bricks = new Array(this.NROWS);
            for (i=0; i < this.NROWS; i++) {
                this.bricks[i] = new Array(this.NCOLS);
                for (j=0; j < this.NCOLS; j++) {
                    this.bricks[i][j] = 1;
                }
            }
        },

        drawBricks: function() {
            for (i=0; i < this.NROWS; i++) {
                this.ctx.fillStyle = this.rowcolors[i];
                for (j=0; j < this.NCOLS; j++) {
                    if (this.bricks[i][j] == 1) {
                        this.rect((j * (this.BRICKWIDTH + this.PADDING)) + this.PADDING, 
                                (i * (this.BRICKHEIGHT + this.PADDING)) + this.PADDING,
                                this.BRICKWIDTH, this.BRICKHEIGHT);
                    }
                }
            }
        }
    }
});
