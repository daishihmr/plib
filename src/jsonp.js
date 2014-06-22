/**
 * @class
 */
var Jsonp = function(param) {
    this.param = param;
    this.callbackName = "_jsonpcallback_" + new Date().getTime() + parseInt(Math.random() * 1000);

    var that = this;
    window[this.callbackName] = function(data) {
        delete window[that.callbackName];
        window.document.body.removeChild(that.script);
        that.onsuccess(data);
    };
};
/**
 *
 */
Jsonp.prototype.send = function() {
    this.script = window.document.createElement("script");
    if (this.param.data) {
        this.script.src = this.param.url + "?" + this.param.data + "&callback=" + this.callbackName;
    } else {
        this.script.src = this.param.url + "?callback=" + this.callbackName;
    }
    try {
        window.document.body.appendChild(this.script);
    } catch (e) {
        this.onerror(e);
    }
};
/**
 *
 */
Jsonp.prototype.onsuccess = function(response) {};
/**
 *
 */
Jsonp.prototype.onerror = function() {};
/**
 *
 */
Jsonp.prototype.oncomplete = function() {};
