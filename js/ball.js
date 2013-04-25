define([], function() {

    return {

        app: null,
        ctx: null,
        radius: 9,
        ballColour: "#725d3c",
        ballPosition: {
            x: 25,
            y: 250,
        },
        velocity: {
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
            return (this.tempBallPosition.x - this.radius <= 0);
        },

        hasBallHitRightWall: function() {
            return (this.tempBallPosition.x + this.radius >= this.app.WIDTH);
        },

        hasBallHitTop: function() {
            return (this.ballPosition.y + this.velocity.y - this.radius < 0);
        },

        isBallMovingDown: function() {
            return (this.velocity.y > 0);
        },

        correctBallPlacementAfterHittingWall: function() {
            this.tempBallPosition.x = (this.hasBallHitLeftWall()) ? this.radius : this.app.WIDTH - this.radius;
        },

        drawBall: function() {
            this.ctx.fillStyle = this.ballColour;
            this.circle(this.ballPosition.x, this.ballPosition.y, this.radius);
        },

        draw: function() {
            this.tempBallPosition = {
                x: this.ballPosition.x + this.velocity.x,
                y: this.ballPosition.y + this.velocity.y
            };

            this.drawBall();

            // If the ball has hit the wall
            if (this.hasBallHitWall()) {
                this.correctBallPlacementAfterHittingWall();
                this.velocity.x *= -1;
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
