/**
 * @class
 * @extends Sprite
 */
var Fighter = function(color, w, h) {
    var canvas = new Canvas(w, h);
    var context = canvas.context;

    Util.setStyle(context, 220);

    context.beginPath();
    context.moveTo(w*0.35, h*0.4);
    context.lineTo(w*0.4, h*0.8);
    context.lineTo(w*0.2, h*0.9);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(w*0.65, h*0.4);
    context.lineTo(w*0.8, h*0.9);
    context.lineTo(w*0.6, h*0.8);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(w*0.5, h*0.1);
    context.lineTo(w*0.65, h*0.7);
    context.lineTo(w*0.35, h*0.7);
    context.closePath();
    context.fill();
    context.stroke();

    Sprite.call(this, canvas.toTexture());
};
Fighter.prototype = Object.create(Sprite.prototype);
