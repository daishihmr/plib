/**
 * @class
 * @extends Sprite
 */
var Circle = function(color, radius) {
    this.radius = radius;

    var texture = new Canvas(radius*2, radius*2)
        .set({ color: color })
        .drawCircle(radius, radius, radius-2)
        .toTexture();

    Sprite.call(this, texture);
};
Circle.prototype = Object.create(Sprite.prototype);
