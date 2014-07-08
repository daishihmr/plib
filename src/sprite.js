/**
 * @class
 * @extends Object2d
 * @param {HTMLCanvasElement} texture
 */
var Sprite = function(texture) {
    Object2d.call(this);

    /**
     *
     */
    this.texture = texture;
    /**
     *
     */
    this.width = texture.width;
    /**
     *
     */
    this.height = texture.height;

    /**
     *
     */
    this.alpha = 1.0;

    /**
     *
     */
    this.blendMode = "lighter";
};
Sprite.prototype = Object.create(Object2d.prototype);
Sprite.prototype.draw = function(context) {
    context.globalAlpha = this.alpha;
    context.globalCompositeOperation = this.blendMode;

    context.drawImage(this.texture, -this.width * this.originX, -this.height * this.originY);
};

/**
 *
 */
Sprite.prototype.isHitPoint = function(point) {
    var w = (this.width*this.scaleX)*0.5;
    var h = (this.height*this.scaleY)*0.5;
    return this.x - w <= point.x && point.x < this.x + w && this.y - h <= point.y && point.y < this.y + h;
};

/**
 *
 */
Sprite.prototype.setAlpha = function(alpha) {
    this.alpha = alpha;
    return this;
};