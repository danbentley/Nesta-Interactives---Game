define(['lib/array.shuffle'], function() {

    return {

        ctx: null,
        WIDTH: 0,
        HEIGHT: 0,
        rightDown: false,
        leftDown: false,
        canvasMinX: 0,
        canvasMaxX: 0,
        POINTS_PER_BRICK: 30,
        score: 88009770,
        $game: $('.game'),
        $finalScore: $('.final-score'),
        SCORE_COLOUR_CLASSES: ['red', 'green', 'blue', 'orange'],
        $currentScore: $('#current-score'),
        $currentLives: $('#lives'),
        $playAgain: $('#play-again'),
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
            this.canvasMinX = $("#canvas").offset().left;
            this.canvasMaxX = this.canvasMinX + this.WIDTH;
            this.drawLives();
            this.addListeners();
        },

        addListeners: function() {

            this.$playAgain.on('click', $.proxy(function(e) {
                this.reset();
                e.preventDefault();
            }, this));

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

            $(window).on('game.over', $.proxy(function() {
                this.$game.addClass('complete');
                this.updateFinalScore();
                clearInterval(this.drawIntervalId);
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
                    $(window).trigger('mouse.moved', [e.pageX, e.pageY]);
                }
            }, this));
        },

        reset: function() {
            this.$game.removeClass('complete');
            this.score = 0;
            this.currentLives = 3;
            this.drawLives();
            $(window).trigger('game.reset');
        },

        drawLives: function() {
            var lives = this.currentLives;
            var markup = '';
            for(var i=0; i < lives; i++) {
                markup += '<span class="available life">&times;</span>';
            }
            this.$currentLives.html(markup);
        },

        deductLife: function() {
            var availableLives = this.$currentLives.find('.available');
            if (availableLives.length > 0) {
                $(availableLives[0]).removeClass('available');
            }
        },

        updateFinalScore: function() {
            var score = this.score + '';
            var scorePieces = score.split("");
            var markup = '';

            var colours = this.SCORE_COLOUR_CLASSES.shuffle();

            var scorePiecesLength = scorePieces.length;
            for (var i=0; i < scorePiecesLength; i++) {
                var scorePart = scorePieces[i];
                var colour = (i < colours.length) ? colours[i] : colours[i % colours.length];
                markup += '<span class="number no-' + scorePart + ' ' + colour + '"></span>';
            }

            this.$finalScore.html(markup);
        }
    }
});
