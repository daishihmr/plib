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
    this._fontSize = fontSize || 24;
    this._fontFamily = Label.DEFAULT_FONT;
    this.setColor(color || 0);

    var texture = this.updateText();
    Sprite.call(this, texture);
};
Label.prototype = Object.create(Sprite.prototype, {
    text: {
        get: function() { return this._text },
        set: function(v) {
            this.setText(v);
        },
    },
    fontSize: {
        get: function() { return this._fontSize },
        set: function(v) {
            this.setFontSize(v);
        },
    },
    fontFamily: {
        get: function() { return this._fontFamily },
        set: function(v) {
            this.setFontFamily(v);
        },
    },
});
/**
 *
 */
Label.prototype.setColor = function(color) {
    // Util.setStyle(this, color);
    this.fillStyle = "hsla(" + color + ", 50%, 80%, 1.0)";
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
Label.prototype.setFontSize = function(fontSize) {
    this._fontSize = fontSize;
    this.texture = this.updateText();
    this.width = this.texture.width;
    this.height = this.texture.height;
};
/**
 *
 */
Label.prototype.setFontFamily = function(fontSize) {
    this._fontFamily = fontFamily;
    this.texture = this.updateText();
    this.width = this.texture.width;
    this.height = this.texture.height;
};
/**
 *
 */
Label.prototype.updateText = function() {
    var c = window.document.createElement("canvas");
    var ctx = c.getContext2d(true);

    ctx.font = "" + this._fontSize + "px '" + this._fontFamily + "'";

    var metrics = ctx.measureText(this._text);
    c.width = metrics.width + 5;
    c.height = this._fontSize;

    ctx.font = "" + this._fontSize + "px '" + this._fontFamily + "'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.fillStyle;
    // ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;

    ctx.fillText(this._text, c.width*0.5, c.height*0.5);
    // ctx.strokeText(this._text, c.width*0.5, c.height*0.5);

    return c;
};

Label.DEFAULT_FONT = "sans-serif";
