/**
 * @type Object
 */
var Assets = {};

/**
 * @class
 * @extends Scene
 * @param {Object.<String, String>} assets
 * @param {Scene} nextScene
 */
var AssetLoadScene = function(assets, nextScene) {
    Scene.call(this);

    this.nextScene = nextScene;

    this.allCount = 0;
    for (var name in assets) if (assets.hasOwnProperty(name)) {
        var ext = assets[name].match(/\.\w+/);
        if (ext) {
            switch (ext[0]) {
            case ".mp3":
                this._loadAudio(name, assets[name]);
                break;
            }
        }
        this.allCount += 1;
    }
    this.loadedCount = 0;

    var label = this.label = new Label("ロード中...", 20, 240);
    label.x = SC_W*0.5;
    label.y = SC_H*0.5;
    label.addChildTo(this);
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
AssetLoadScene.prototype.update = function(app) {
    this.label.scaleX = this.label.scaleY = 1.0 + Math.sin(app.frame*0.1) * 0.2
    if (this.loadedCount === this.allCount) {
        app.replaceScene(this.nextScene);
    }
};
