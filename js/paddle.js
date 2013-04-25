define(['paddle', 'ball'], function(paddle, ball) {

    return {

        app: null,
        ball: null,
        ctx: null,
        colour: "#656565",
        height: 13,
        width: 110,

        position: {
            x: 0,
            y: 30
        },

        init: function(app) {
            this.app = app;
            this.ball = this.app.ball;
            this.ctx = this.app.ctx;

            this.position.x = (this.app.WIDTH - this.width) / 2;
            this.position.y = this.app.HEIGHT - this.height - 30;
            this.addListeners();
        },

        addListeners: function() {
            $(window).on('mouse.moved', $.proxy(function(e, x, y) {
                this.position.x = Math.max(x - this.app.canvasMinX - (this.width / 2), 0);
                this.position.x = Math.min(this.app.WIDTH - this.width, this.position.x);
            }, this));
        },

        draw: function() {
            // Move paddle
            if (this.app.rightDown && this.canPaddleMoveRight()) {
                this.position.x += 5;
            } else if (this.app.leftDown && this.canPaddleMoveLeft()) {
                this.position.x -= 5;
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
