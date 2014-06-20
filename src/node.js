/**
 * @class
 */
var Node = function() {
    this.parent = null;
    this.children = [];
    this.frame = 0;
};
/**
 * @param {Node} child
 */
Node.prototype.addChild = function(child) {
    child.parent = this;
    this.children.push(child);
    child.onadded();
};
/**
 * @param {Node} parent
 */
Node.prototype.addChildTo = function(parent) {
    parent.addChild(this);
};
/**
 * @param {Node} child
 */
Node.prototype.removeChild = function(child) {
    var idx = this.children.indexOf(child);
    if (idx >= 0) {
        child.parent = null;
        this.children.splice(idx, 1);
        child.onremoved();
    }
};
/**
 *
 */
Node.prototype.remove = function() {
    if (this.parent !== null) this.parent.removeChild(this);
};
/**
 * @private
 * @param {Application} app
 */
Node.prototype._update = function(app) {
    this.update(app);
    var copied = [].concat(this.children);
    for (var i = 0, len = copied.length; i < len; i++) {
        copied[i]._update(app);
    }
    this.frame += 1;
};
/**
 * @private
 * @param {CanvasRenderingContext2D} context
 */
Node.prototype._draw = function(context) {
    context.save();
    this.draw(context);
    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i]._draw(context);
    }
    context.restore();
};
/**
 * @param {Application} app
 */
Node.prototype.update = function(app) {};
/**
 * @param {CanvasRenderingContext2D} context
 */
Node.prototype.draw = function(context) {};
/**
 *
 */
Node.prototype.onadded = function() {};
/**
 *
 */
Node.prototype.onremoved = function() {};
