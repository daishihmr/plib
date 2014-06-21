var Object2d = function() {
    Node.call(this);
    /**
     *
     */
    this.width = 0;
    /**
     *
     */
    this.height = 0;

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
    this.originX = 0.5;

    /**
     *
     */
    this.originY = 0.5;
};
Object2d.prototype = Object.create(Node.prototype);

/**
 *
 */
Object2d.prototype.predraw = function(context) {
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
};

/**
 *
 */
Object2d.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

/**
 *
 */
Object2d.prototype.setScale = function(x, y) {
    if (arguments.length === 1) y = x;
    this.scaleX = x;
    this.scaleY = y;
    return this;
};

/**
 *
 */
Object2d.prototype.setRotation = function(r) {
    this.rotation = r;
    return this;
};
