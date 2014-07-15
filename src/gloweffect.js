/**
 * @class
 */
var GlowEffect = function(sprite, radius, scale, alpha) {
    radius = radius || 20;
    scale = scale || 1.2;
    alpha = alpha || 1;

    var canvas = new Canvas(sprite.width * scale * 2, sprite.height * scale * 2);
    canvas.drawImage(sprite.texture, sprite.width * scale * 0.5, sprite.height * scale * 0.5, sprite.width * scale, sprite.height * scale);
    canvas.stackBlur(radius);

    Sprite.call(this, canvas.toTexture());

    this.alpha = alpha;
};
GlowEffect.prototype = Object.create(Sprite.prototype);

Sprite.prototype.glow = function(radius, scale, alpha) {
    this.glowEffect = new GlowEffect(this, radius, scale, alpha).addChildTo(this);
    return this;
};
