/**
 * @class
 * @extends Action
 */
var TweenAction = function(param, time, ease) {
    Action.call(this, time);

    this.param = param;
    this.ease = ease || function(pos) { return pos };

    this.initials = {};
    this.deltas = {};
};
TweenAction.prototype = Object.create(Action.prototype);
TweenAction.prototype.initialize = function(target) {
    Action.prototype.initialize.call(this, target);

    for (var key in this.param) {
        this.initials[key] = target[key];
        this.deltas[key] = this.param[key] - target[key];
    }
};
TweenAction.prototype.update = function(target) {
    var p = this.ease(this.currentPos / this.time);
    for (var key in this.param) {
        target[key] = this.initials[key] + this.deltas[key] * p;
    }
    return Action.prototype.update.call(this, target);
};
