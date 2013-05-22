define([], function() {

    return {

        app: null,
        ctx: null,
        radius: 9,
        colour: "#725d3c",
        position: {},
        velocity: {},

        init: function(app) {
            this.app = app;
            this.ctx = this.app.ctx;
            this.restart();
        },

        restart: function() {
            this.position = {
                x: 25,
                y: 250,
            };
            this.velocity = {
                x: 8,
                y: -8,
            };
        },

        hasHitWall: function() {
            return (this.hasHitLeftWall() || this.hasHitRightWall());
        },

        hasHitLeftWall: function() {
            return (this.position.x - this.radius <= 0);
        },

        hasHitRightWall: function() {
            return (this.position.x + this.radius >= this.app.WIDTH);
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
            this.position.x = (this.hasHitLeftWall()) ? this.radius : this.app.WIDTH - this.radius;
        },

        updatePosition: function() {
            this.position = {
                x: this.position.x + this.velocity.x,
                y: this.position.y + this.velocity.y
            };

            // If the ball has hit the wall
            if (this.hasHitWall()) {
                this.correctBallPlacementAfterHittingWall();
                this.velocity.x *= -1;
            }
        },

        draw: function() {
            this.updatePosition();
            this.ctx.fillStyle = this.colour;
            this.circle(this.position.x, this.position.y, this.radius);
        },

        circle: function(x,y,r) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
            this.ctx.closePath();
            this.ctx.fill();
        }
    };
});
