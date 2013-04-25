define(['paddle', 'ball'], function(paddle, ball) {

    return {

        app: null,
        ball: null,
        ctx: null,
        colour: "#656565",
        height: 13,
        width: 110,
        paddlex: 0,

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
        position: {
            x: 0,
            y: 0
        },

        init: function(app) {
            this.app = app;
            this.ball = this.app.ball;
            this.ctx = this.app.ctx;

            this.paddlex = (this.app.WIDTH - this.width) / 2;
            this.addListeners();
        },

        addListeners: function() {
            $(window).on('mouse.moved', $.proxy(function(e, x, y) {
                this.paddlex = Math.max(x - this.app.canvasMinX - (this.width / 2), 0);
                this.paddlex = Math.min(this.app.WIDTH - this.width, this.paddlex);
            }, this));
        },

        draw: function() {
            this.position = {
                x: this.paddlex + this.PADDLE_POSITION_OFFSET.x,
                y: this.app.HEIGHT - this.height + this.PADDLE_POSITION_OFFSET.y
            };

            // Move paddle
            if (this.app.rightDown && this.canPaddleMoveRight()) {
                this.paddlex += 5;
            } else if (this.app.leftDown && this.canPaddleMoveLeft()) {
                this.paddlex -= 5;
            }
            this.ctx.fillStyle = this.colour;
            this.rect(this.position.x, this.position.y, this.width, this.height);
        },

        canPaddleMoveLeft: function() {
            return (this.position.x > 0);
        },

        canPaddleMoveRight: function() {
            return (this.position.x + this.width < this.app.WIDTH);
        },

        rect: function(x,y,w,h) {
            this.ctx.beginPath();
            this.ctx.rect(x, y, w, h);
            this.ctx.closePath();
            this.ctx.fill();
        },
    };
});
