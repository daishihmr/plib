/**
 * @class
 * @extends Sprite
 */
var Polygon = function(color, radius, sides) {
    var texture = window.document.createElement("canvas");
    texture.width = radius*2;
    texture.height = radius*2;

    var context = texture.getContext2d();

    Util.setStyle(context, color);

    context.beginPath();
    context.moveTo(radius + Math.cos(0) * (radius-2), radius + Math.sin(0) * (radius-2));
    for (var i = 1; i < sides; i++) {
        var a = Math.PI*2 * i / sides;
        context.lineTo(radius + Math.cos(a) * (radius-2), radius + Math.sin(a) * (radius-2));
    }
    context.closePath();
    context.fill();
    context.stroke();

    Sprite.call(this, texture);
};
Polygon.prototype = Object.create(Sprite.prototype);
