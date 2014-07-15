/**
 * @class
 */
var Map = function(data) {
    Object2d.call(this);

    this.width = SC_W;
    this.height = SC_H;
    this.cellsize = 16;

    this.data = data;

    var chips = {};
    var cs = this.cellsize;
    var canvas = new Canvas(Math.max(data[0].length * cs, this.width), Math.max(data.length * cs, this.height));
    var context = canvas.context;

    context.globalAlpha = 0.7;

    for (var y = 0; y < data.length; y++) {
        for (var x = 0; x < data[y].length; x++) {
            var d = data[y][x];
            if (d >= 0) {
                if (chips[d] === undefined) {
                    chips[d] = new Rect(d * 39, cs, cs).texture;
                }
                context.drawImage(chips[d], cs * x, cs * y, cs, cs);
            }
        }
    }

    this.texture = canvas.toTexture();
};
Map.prototype = Object.create(Object2d.prototype);

Map.prototype.predraw = function(context) {};

Map.prototype.draw = function(context) {
    context.drawImage(this.texture, -this.x, -this.y, this.width, this.height, 0, 0, this.width, this.height);
};

Map.prototype.isHitPoint = function(point) {
    var x = parseInt((point.x - this.x) / this.cellsize);
    var y = parseInt((point.y - this.y) / this.cellsize);
    if (y < 0 || this.data.length <= y) return false;
    return this.data[y][x] >= 0;
};

Map.join2DArray = function(a, b, horizontal) {
    if (horizontal) {
        for (var i = 0; i < a.length; i++) {
            a[i] = a[i].concat(b[i]);
        }
    } else {
        a = a.concat(b);
    }
};
