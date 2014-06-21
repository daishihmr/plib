/**
 * @class
 * @extends Sprite
 */
var RoundRect = function(color, width, height) {
    var texture = new Canvas(width, height)
        .set({ color: color })
        .drawRoundRect(2, 2, width-4, height-4)
        .toTexture();

    Sprite.call(this, texture);
};
RoundRect.prototype = Object.create(Sprite.prototype);
