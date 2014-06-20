/**
 * @class
 * @extends Node
 * @param {HTMLCanvasElement} texture
 */
var Sprite = function(texture) {
    Node.call(this);

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
    this.x = 0.0;
    /**
     *
     */
    this.y = 0.0;
    /**
     *
     */
    this.rotation = 0.0;
    /**
     *
     */
    this.scaleX = 1.0;
    /**
     *
     */
    this.scaleY = 1.0;

    /**
     *
     */
    this.alpha = 1.0;

    /**
     *
     */
    this.blendMode = "lighter";

    /**
     *
     */
    this.visible = true;
};
Sprite.prototype = Object.create(Node.prototype);
Sprite.prototype.draw = function(context) {
    if (!this.visible) return;

    context.globalAlpha = this.alpha;
    context.globalCompositeOperation = this.blendMode;

    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
    context.drawImage(this.texture, -this.width*0.5, -this.height*0.5);
};
/**
 *
 */
Sprite.prototype.isHitPoint = function(point) {
    var w = (this.width*this.scaleX)*0.5;
    var h = (this.height*this.scaleY)*0.5;
    return this.x - w <= point.x && point.x < this.x + w && this.y - h <= point.y && point.y < this.y + h;
};
