/**
 * @class
 * @extends Node
 */
var Tweener = function(target) {
    Node.call(this);

    this.target = target;
    this.actions = [];
    this.actionPointer = 0;
    this.loop = false;

    this.addChildTo(target);
};
Tweener.prototype = Object.create(Node.prototype);
Tweener.prototype.update = function(app) {
    var action = this.actions[this.actionPointer];
    if (action !== undefined) {
        if (action.currentPos < 0) {
            action.initialize(this.target);
        }
        if (action.update(this.target)) {
            this.actionPointer += 1;
            if (this.actions.length === this.actionPointer) {
                if (this.loop) {
                    this.actionPointer = 0;
                } else {
                    this.remove();
                }
            }
        }
    }
};
/**
 *
 */
Tweener.prototype.add = function(action) {
    this.actions.push(action);
    return this;
};
/**
 *
 */
Tweener.prototype.to = function(params, time, ease) {
    return this.add(new TweenAction(params, time, ease));
};
/**
 *
 */
Tweener.prototype.moveTo = function(x, y, time, ease) {
    return this.to({
        x: x,
        y: y
    }, time, ease);
};
/**
 *
 */
Tweener.prototype.wait = function(frame) {
    return this.add(new Action(frame));
};
/**
 *
 */
Tweener.prototype.then = function(func) {
    return this.add(new CallAction(func));
};
/**
 *
 */
Tweener.prototype.setLoop = function(loop) {
    this.loop = loop;
    return this;
};
