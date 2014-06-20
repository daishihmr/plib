/**
 * @class
 */
var Action = function(time) {
    this.time = time;
    this.currentPos = -1;
};
/**
 *
 */
Action.prototype.initialize = function(target) {
    this.currentPos = 0;
};
/**
 *
 */
Action.prototype.update = function(target) {
    this.currentPos += 1;
    return this.currentPos >= this.time;
};
