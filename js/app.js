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
        POINTS_PER_BRICK: 30,
        score: 0,
        $currentScore: $('#current-score'),
        $currentLives: $('#lives'),
        currentLives: 3,
        KEY_CODES: {
            RIGHT: 39,
            LEFT: 37
        },

        init: function() {
            this.ctx = $('#canvas')[0].getContext("2d");
            this.WIDTH = $("#canvas").width();
            this.HEIGHT = $("#canvas").height();
            this.BRICKWIDTH = (this.WIDTH / this.NCOLS) - 1;
            this.paddlex = (this.WIDTH - this.paddlew) / 2;
            this.canvasMinX = $("#canvas").offset().left;
            this.canvasMaxX = this.canvasMinX + this.WIDTH;
            this.drawLives();
            this.addListeners();
        },

        addListeners: function() {
            $(window).on('brick.destroyed', $.proxy(function() {
                this.score += this.POINTS_PER_BRICK;
                this.$currentScore.find('strong').html(this.score);
            }, this));

            $(window).on('player.died', $.proxy(function() {
                this.currentLives--;
                this.deductLife();
                if (this.currentLives === 0) {
                    $(window).trigger('game.over');
                } 
            }, this));

            $(document).keydown($.proxy(function(e) {
                if (e.keyCode == this.KEY_CODES.RIGHT) {
                    this.rightDown = true;
                } else if (e.keyCode == this.KEY_CODES.LEFT) {
                    this.leftDown = true;
                }
            }, this));

            $(document).keyup($.proxy(function(e) {
                if (e.keyCode == this.KEY_CODES.RIGHT) {
                    this.rightDown = false;
                } else if (e.keyCode == this.KEY_CODES.LEFT) {
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

        drawLives: function() {
            var lives = this.currentLives;
            var markup = '';
            for (var i=0; i < lives; i++) {
                markup += '<span class="available life">&times;</span>';
            }
            this.$currentLives.append(markup);
        },

        deductLife: function() {
            var availableLives = this.$currentLives.find('.available');
            if (availableLives.length > 0) {
                $(availableLives[0]).removeClass('available');
            }
        }
    }
});
