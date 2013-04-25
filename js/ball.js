define([], function() {

    return {

        app: null,
        ctx: null,
        radius: 9,
        colour: "#725d3c",
        position: {
            x: 25,
            y: 250,
        },
        velocity: {
            x: 1.6,
            y: -2,
        },
        // Used to calculate where the ball is going/what it's hitting
        tempPosition: {
            x: 0,
            y: 0,
        },

        init: function(app) {
            this.app = app;
            this.ctx = this.app.ctx;
        },

        hasHitWall: function() {
            return (this.hasHitLeftWall() || this.hasHitRightWall());
        },

        hasHitLeftWall: function() {
            return (this.tempPosition.x - this.radius <= 0);
        },

        hasHitRightWall: function() {
            return (this.tempPosition.x + this.radius >= this.app.WIDTH);
        },

        hasHitTop: function() {
            return (this.position.y + this.velocity.y - this.radius < 0);
        },

        isMovingDown: function() {
            return (this.velocity.y > 0);
        },

        /**
         * called when the ball hits some above. Whether it's bricks or the
         * wall
         *
         */
        bounceUpOrDown: function() {
            this.velocity.y *= -1;
        },

        correctBallPlacementAfterHittingWall: function() {
            this.tempPosition.x = (this.hasHitLeftWall()) ? this.radius : this.app.WIDTH - this.radius;
        },

        drawBall: function() {
            this.ctx.fillStyle = this.colour;
            this.circle(this.position.x, this.position.y, this.radius);
        },

        draw: function() {
            this.tempPosition = {
                x: this.position.x + this.velocity.x,
                y: this.position.y + this.velocity.y
            };

            this.drawBall();

            // If the ball has hit the wall
            if (this.hasHitWall()) {
                this.correctBallPlacementAfterHittingWall();
                this.velocity.x *= -1;
            }

            this.position = this.tempPosition;
        },

        circle: function(x,y,r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
    };
});
