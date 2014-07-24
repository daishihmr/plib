/**
 * @type Object
 */
var Assets = {};

/**
 * @class
 * @extends Scene
 * @param {Object.<String, String>} assets
 * @param {Scene|function} nextScene
 */
var AssetLoadScene = function(assets, nextScene) {
    Scene.call(this);

    this.nextScene = nextScene;

    this.allCount = 0;
    for (var key in assets) if (assets.hasOwnProperty(key)) {
        var asset = assets[key];
        if (typeof asset === "string") {
            var ext = asset.match(/\.\w+/);
            if (ext) {
                switch (ext[0]) {
                case ".mp3":
                    this._loadAudio(key, asset);
                    break;
                case ".ttf":
                    this._loadFont(key, asset);
                    break;
                case ".ttf":
                    this._loadFont(key, asset);
                    break;
                }
            }
        } else {
            switch (asset.type) {
            case "sound":
                this._loadJsAudio(key, asset.name);
                break;
            }
        }
        this.allCount += 1;
    }
    this.loadedCount = 0;

    new Loading().addChildTo(this);
};
AssetLoadScene.prototype = Object.create(Scene.prototype);

/**
 * @private
 */
AssetLoadScene.prototype._loadAudio = function(assetName, url) {
    var xhr = new Xhr({
        url: url,
        responseType: "arraybuffer"
    });
    xhr.onsuccess = function(response) {
        var audio = new Sound(response);
        var that = this;
        audio.onload = function() {
            Assets[assetName] = this;
            that.loadedCount += 1;
        };
    }.bind(this);
    xhr.send();
};
/**
 * @private
 */
AssetLoadScene.prototype._loadJsAudio = function(assetName, name) {
    var binaryString = window.atob(BINARY_ASSETS[name]);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        var ascii = binaryString.charCodeAt(i);
        bytes[i] = ascii;
    }

    var audio = new Sound(bytes.buffer);
    var that = this;
    audio.onload = function() {
        Assets[assetName] = this;
        that.loadedCount += 1;
    };
};


/**
 * @private
 */
AssetLoadScene.prototype._loadFont = function(assetName, url) {
    var styleElm = window.document.createElement("style");
    styleElm.textContent = "@font-face {\n\
    font-family: '" + assetName + "';\n\
    src: url(" + url + ");\n\
}\n";
    window.document.head.appendChild(styleElm);

    var tester = window.document.createElement("span");
    tester.style.fontFamily = "'" + assetName + "', 'monospace'";
    tester.innerHTML = "QW@HhsXJ";
    window.document.body.appendChild(tester);

    var before = tester.offsetWidth;
    console.debug("_loadFont(" + url + ") before:" + before);
    var timeout = 3000;

    var that = this;
    var checkLoadFont = function() {
        timeout -= 1;
        if (tester.offsetWidth !== before || timeout < 0) {
            console.debug("_loadFont(" + url + ") after:" + tester.offsetWidth);
            window.document.body.removeChild(tester);
            that.loadedCount += 1;
        } else {
            window.setTimeout(checkLoadFont, 100);
        }
    };
    checkLoadFont();
};

AssetLoadScene.prototype.update = function(app) {
    if (this.loadedCount === this.allCount) {
        if (typeof(this.nextScene) === "function") {
            app.replaceScene(new this.nextScene());
        } else {
            app.replaceScene(this.nextScene);
        }
    }
};
