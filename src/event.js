/**
 * @class
 */
var Event = function(type, params) {
    this.type = type;
    this.params = params;
};

/**
 * @class
 */
var EventDispatcher = function() {
    this.listeners = {};
};

/**
 *
 */
EventDispatcher.prototype.on = function(type, listener) {
    if (this.listeners[type] === undefined) {
        this.listeners[type] = [];
    }

    this.listeners[type].push(listener);

    return this;
};

/**
 *
 */
EventDispatcher.prototype.one = function(type, listener) {
    var temp = function(event) {
        listener.call(this, event);
        this.off(type, temp);
    };
    this.on(type, temp);
};

/**
 *
 */
EventDispatcher.prototype.off = function(type, listener) {
    if (this.listeners[type] === undefined) {
        this.listeners[type] = [];
    }

    var listeners = this.listeners[type];
    var idx = listeners.indexOf(listener);
    if (idx >= 0) {
        listeners.splice(idx, 1);
    }

    if (this["on" + type]) {
        delete this["on" + type];
    }

    return this;
};

/**
 *
 */
EventDispatcher.prototype.clearEventListener = function(type) {
    this.listeners[type] = [];
    if (this["on" + type]) {
        delete this["on" + type];
    }
};

/**
 *
 */
EventDispatcher.prototype.fire = function(event) {
    if (this["on" + event.type]) {
        this["on" + event.type](event);
    }

    var listeners = this.listeners[event.type];
    if (listeners !== undefined) {
        var copied = [].concat(listeners);
        for (var i = 0, len = copied.length; i < len; i++) {
            copied[i].call(this, event);
        }
    }

    return this;
};

/**
 *
 */
EventDispatcher.prototype.flare = function(type) {
    return this.fire(new Event(type));
};
