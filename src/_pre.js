/**
 * @const
 */
var SC_W = SC_W || 320;

/**
 * @const
 */
var SC_H = SC_H || 320;

/**
 * @const
 */
var SC_ASPECT = SC_W / SC_H;

/**
 * @const
 */
var SC_ASPECT_INV = SC_H / SC_W;

/**
 * @const
 */
var IS_MOBILE = (window.navigator.userAgent.indexOf("iPhone") !== -1 || window.navigator.userAgent.indexOf("Android") !== -1);

HTMLCanvasElement.prototype.getContext2d = function() {
    var context = this.getContext("2d");
    if (context.hasOwnProperty("imageSmoothingEnabled")) {
        context.imageSmoothingEnabled = false;
    } else if (context.hasOwnProperty("mozImageSmoothingEnabled")) {
        context.mozImageSmoothingEnabled = false;
    } else if (context.hasOwnProperty("webkitImageSmoothingEnabled")) {
        context.webkitImageSmoothingEnabled = false;
    }
    return context;
};
