/**
 * @class
 * @extends Sprite
 */
var RandomPolygon = function(color, radius, sides) {
    var texture = window.document.createElement("canvas");
    texture.width = radius*2;
    texture.height = radius*2;

    var context = texture.getContext2d();

    Util.setStyle(context, color);

    var d = (radius-2) * (0.5 + Math.random() * 0.5)
    context.beginPath();
    context.moveTo(radius + Math.cos(0) * d, radius + Math.sin(0) * d);
    for (var i = 1; i < sides; i++) {
        var a = Math.PI*2 * i / sides;
        d = (radius-2) * (0.5 + Math.random() * 0.5)
        context.lineTo(radius + Math.cos(a) * d, radius + Math.sin(a) * d);
    }
    context.closePath();
    context.fill();
    context.stroke();

    Sprite.call(this, texture);
};
RandomPolygon.prototype = Object.create(Sprite.prototype);
