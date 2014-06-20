/**
 * @class
 * @extends Node
 */
var Label = function(text, fontSize, color) {
    this.x = 0.0;
    this.y = 0.0;
    this.rotation = 0.0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.alpha = 1.0;

    this._text = text;
    this.fontSize = fontSize;
    this.setColor(color);

    var texture = this.updateText();
    Sprite.call(this, texture);
};
Label.prototype = Object.create(Sprite.prototype, {
    text: {
        get: function() { return this._text },
        set: function(v) {
            this.setText(v);
        }
    },
});
/**
 *
 */
Label.prototype.setColor = function(color) {
    Util.setStyle(this, color);
};
/**
 *
 */
Label.prototype.setText = function(text) {
    this._text = text;
    this.texture = this.updateText();
    this.width = this.texture.width;
    this.height = this.texture.height;
};
/**
 *
 */
Label.prototype.updateText = function() {
    var c = window.document.createElement("canvas");
    var ctx = c.getContext2d();

    ctx.font = "" + this.fontSize + "px 'uni'";

    var metrics = ctx.measureText(this._text);
    c.width = metrics.width + 5;
    c.height = this.fontSize;

    ctx.font = "" + this.fontSize + "px 'uni'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;

    ctx.fillText(this._text, c.width*0.5, c.height*0.5);
    ctx.strokeText(this._text, c.width*0.5, c.height*0.5);

    return c;
};
