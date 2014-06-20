/**
 * @class
 * @extends Action
 */
var CallAction = function(func) {
    Action.call(this, 0);
    this.func = func;
};
CallAction.prototype = Object.create(Action.prototype);
CallAction.prototype.update = function(target) {
    if (this.func) {
        this.func.call(target);
    }
    return Action.prototype.update.call(this, target);
};
