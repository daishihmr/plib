/**
 *
 */
var Menu = function() {
    Node.call(this);
    this.selected = null;
    this.enabled = true;
};
Menu.prototype = Object.create(Node.prototype);
Menu.prototype.update = function(app) {
    if (this.enabled) {
        var p = app.pointing;
        for (var i = 0, len = this.children.length; i < len; i++) {
            var item = this.children[i];
            if (this.selected === item) {
                item.scaleX = item.scaleY = 1.0 + Math.sin(app.frame * 0.3) * 0.1;
            } else {
                item.scaleX = item.scaleY = 1.0;
            }

            if (p.isEnd && item.isHitPoint(p)) {
                if (this.selected === item) {
                    this.onSelectItem(item);
                } else {
                    this.selected = item;
                    this.onPreSelectItem(item);
                }
                break;
            }
        }
    }
};
Menu.prototype.enable = function() {
    this.enabled = true;
};
Menu.prototype.disable = function() {
    this.enabled = false;
    for (var i = 0, len = this.children.length; i < len; i++) {
        var item = this.children[i];
        item.scaleX = item.scaleY = 1.0;
    }
};
Menu.prototype.onPreSelectItem = function(item) {};
Menu.prototype.onSelectItem = function(item) {};
