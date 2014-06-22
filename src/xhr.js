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

    var async = param.async;
    if (async === undefined) {
        async = true;
    }

    xhr.open(param.type || "GET", param.url, async);
    if (param.withCredentials) {
        xhr.withCredentials = param.withCredentials;
    }
    if (param.requestHeader) {
        for (var name in param.requestHeader) if (param.requestHeader.hasOwnProperty(name)) {
            xhr.setRequestHeader(name, param.requestHeader[name]);
        }
    }
    if (param.responseType) {
        xhr.responseType = param.responseType;
    }
};
/**
 *
 */
Xhr.prototype.send = function() {
    console.debug("xhr send to " + this.param.url);
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
