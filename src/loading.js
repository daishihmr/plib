/**
 *
 */
var Loading = function() {
    Object2d.call(this);

    this.setPosition(SC_W * 0.5, SC_H * 0.5);

    this.bg = new Object2d()
        .addChildTo(this);
    this.bg.draw = function(context) {
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(-SC_W, -SC_H, SC_W*2, SC_H*2);
    };

    new Label("loading...", 20, 200).addChildTo(this);

    var r = 0;
    for (var i = 0; i < 12; i++) {
        new Rect(i * 30, 20, 20)
            .setPosition(Math.cos(r) * 50, Math.sin(r) * 50)
            .addChildTo(this.bg)
            .update = function() {
                this.rotation += 0.1;
            };

        r += Math.PI * 2 / 12;
    }
};
Loading.prototype = Object.create(Object2d.prototype);
Loading.prototype.update = function(app) {
    this.bg.rotation += 0.03;
    this.scaleX = this.scaleY = 1.0 + Math.sin(app.frame * 0.1) * 0.2;
};
