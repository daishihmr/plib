/**
 * @class
 */
var Util = {
    /**
     *
     */
    style: function(color) {
        return {
            fillStyle: "hsla(" + color + ", 80%, 20%, 0.5)",
            strokeStyle: "hsla(" + color + ", 50%, 80%, 1.0)",
            lineWidth: 2,
        };
    },
    /**
     *
     */
    setStyle: function(target, color) {
        var style = this.style(color);
        target.fillStyle = style.fillStyle;
        target.strokeStyle = style.strokeStyle;
        target.lineWidth = style.lineWidth;
    },
    /**
     *
     */
    linearGradient: function(x0, y0, x1, y1, colorStops) {
        var ctx = window.document.createElement("canvas").getContext2d();
        var result = ctx.createLinearGradient(x0, y0, x1, y1);
        for (var i = 0; i < colorStops.length; i++) {
            result.addColorStop(colorStops[i].offset, colorStops[i].color);
        }
        return result;
    },
    /**
     *
     */
    radialGradient: function(x0, y0, r0, x1, y1, r1, colorStops) {
        var ctx = window.document.createElement("canvas").getContext2d();
        var result = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        for (var i = 0; i < colorStops.length; i++) {
            result.addColorStop(colorStops[i].offset, colorStops[i].color);
        }
        return result;
    },
    /**
     *
     */
    range: function(from, to) {
        var result = [];
        for (var i = from; i < to; i++) {
            result.push(i);
        }
        return result;
    },
    /**
     *
     */
    curry: function(f) {
        return function _curry(xs) {
            return xs.length < f.length ? function(x) { return _curry(xs.concat([x])); } : f.apply(undefined, xs);
        }([]);
    },
    /**
     *
     */
    rand: function(min, max) {
        return min + Math.random() * (max - min);
    },
    /**
     *
     */
    randi: function(min, max) {
        return parseInt(min + Math.random() * (max - min));
    },
    /**
     *
     */
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },
};
