/**
 * @class
 * @extends Sprite
 */
var Rect = function(color, width, height) {
    var texture = new Canvas(width, height)
        .set({ color: color })
        .drawRect(2, 2, width-4, height-4)
        .toTexture();

    Sprite.call(this, texture);
};
Rect.prototype = Object.create(Sprite.prototype);
