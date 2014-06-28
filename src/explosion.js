/**
 * @class
 * @extends Node
 */
var Explosion = function(x, y, size) {
    Node.call(this);
    this.x = x;
    this.y = y;
    this.dirCount = 5;
    this.spdRate = size || 1;
    this.particleClass = ExplosionPerticle;
};
Explosion.prototype = Object.create(Node.prototype);
Explosion.prototype.update = function() {
    if (this.children.length === 0) this.remove();
}
Explosion.prototype.onadded = function() {
    for (var i = 0; i < this.dirCount; i++) {
        var v = Explosion.VEL[parseInt(Math.random() * Explosion.VEL.length)];
        var s = this.speed();
        for (var j = 0; j < 5; j++) {
            var p = new this.particleClass();
            if (p) {
                p.x = this.x;
                p.y = this.y;
                p.scaleX = p.scaleY = 1 + (5-j)*0.2;
                p.vx = v.x * (1+j)*s;
                p.vy = v.y * (1+j)*s;
                p.addChildTo(this);
            }
        }
    }
};
Explosion.prototype.speed = function() {
    return 0.8 + Math.random() * 1.2 * this.spdRate;
};
Explosion.VEL = Util.range(0, 16).map(function(v) {
    return {
        x: Math.cos(Math.PI*2 * v/16),
        y: Math.sin(Math.PI*2 * v/16)
    };
});
Explosion.addTarget = null;

/**
 *
 */
var ExplosionPerticle = function() {
    Sprite.call(this, ExplosionPerticle.TEXTURE);
    this.alpha = 0.5;
    this.vx = 0;
    this.vy = 0;
};
ExplosionPerticle.prototype = Object.create(Sprite.prototype);
ExplosionPerticle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.alpha -= 0.01;
    if (this.alpha < 0) this.remove();
};
ExplosionPerticle.TEXTURE = (function() {
    return new Rect(10, 20, 20).texture;
})();

