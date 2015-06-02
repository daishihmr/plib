/**
 * @class
 * @param {HTMLCanvasElement} canvas
 */
var Layer = function(canvas, drawRate) {
    Node.call(this);

    this.canvas = canvas;
    canvas.width = SC_W;
    canvas.height = SC_H;

    this.context = canvas.getContext2d();

    this.drawRate = drawRate;
};
Layer.prototype = Object.create(Node.prototype);
/**
 * @private
 */
Layer.prototype._draw = function() {
    if (this.frame % this.drawRate !== 0) return;

    this.context.clearRect(0, 0, SC_W, SC_H);
    this.context.save();
    this.draw(this.context);
    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i]._draw(this.context);
    }
    this.context.restore();
};

Layer.prototype.clear = function() {
    this.context.clearRect(0, 0, SC_W, SC_H);
};
