/**
 *
 */
var Canvas = function(width, height) {
    this.canvas = window.document.createElement("canvas");
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
    this.context = this.canvas.getContext2d();
};
Canvas.prototype.set = function(params) {
    var c = this.context;
    if (params.color !== undefined) {
        Util.setStyle(c, params.color);
    } else {
        c.fillStyle = params.fillStyle || "red";
        c.strokeStyle = params.strokeStyle || "white";
        c.lineWidth = params.lineWidth || 2;
    }
    return this;
};
Canvas.prototype.toTexture = function() {
    return this.canvas;
};
Canvas.prototype.fillRect = function(x, y, w, h) {
    this.context.fillRect(x, y, w, h);
    return this;
};
Canvas.prototype.drawRect = function(x, y, w, h) {
    this.context.fillRect(x, y, w, h);
    this.context.strokeRect(x, y, w, h);
    return this;
};
Canvas.prototype.drawRoundRect = function(x, y, w, h, r) {
    r = r || 10;

    var c = this.context;
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r);
    c.arcTo(x, y, x + r, y, r);
    c.closePath();
    c.fill();
    c.stroke();
    return this;
};
Canvas.prototype.drawCircle = function(x, y, r) {
    this.context.arc(x, y, r, 0, Math.PI*2, false);
    this.context.fill();
    this.context.stroke();
    return this;
};
Canvas.prototype.drawPolygon = function(x, y, r, sides, offset) {
    offset = offset || 0;

    this.context.beginPath();
    this.context.moveTo(x + Math.cos(offset) * r, y + Math.sin(offset) * r);
    for (var i = 1; i < sides; i++) {
        var a = offset + Math.PI*2 * i / sides;
        this.context.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
};
Canvas.prototype.drawLines = function(vertices) {
    this.context.beginPath();
    this.context.moveTo(arguments[0][0], arguments[0][1]);
    for (var i = 1; i < arguments.length; i++) {
        this.context.lineTo(arguments[i][0], arguments[i][1]);
    }
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
};
