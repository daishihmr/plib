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
    if (this.currentPos === this.time) {
        this.finalize(target);
    }
    return this.currentPos >= this.time;
};
/**
 *
 */
Action.prototype.finalize = function(target) {
};