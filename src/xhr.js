/**
 * @class
 */
var Xhr = function(param) {
    this.param = param;
    var that = this;
    var xhr = this.xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                that.onsuccess(this.response);
            } else {
                that.onerror(this);
            }
            that.oncomplete(this);
        }
    };
    xhr.open(param.type || "GET", param.url);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    if (param.responseType) {
        xhr.responseType = param.responseType;
    }
};
/**
 *
 */
Xhr.prototype.send = function() {
    if (this.param.data) {
        this.xhr.send(this.param.data);
    } else {
        this.xhr.send();
    }
};
/**
 *
 */
Xhr.prototype.onsuccess = function(response) {};
/**
 *
 */
Xhr.prototype.onerror = function(xhr) {};
/**
 *
 */
Xhr.prototype.oncomplete = function(xhr) {};
