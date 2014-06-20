/**
 * @class
 * @extends Node
 */
var Scene = function() {
    Node.call(this);
    this.app = null;
};
Scene.prototype = Object.create(Node.prototype);
/**
 *
 */
Scene.prototype.onenter = function() {};
/**
 *
 */
Scene.prototype.onexit = function() {};
