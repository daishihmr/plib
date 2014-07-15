/*
 * plib.js v0.0.0
 * http://tomcat.dev7.jp/gitbucket/daishi/plib
 * 
 * The MIT License (MIT)
 * Copyright © 2014 daishi_hmr, dev7.jp
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 * associated documentation files (the “Software”), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
/**
 * @const
 */
var SC_W = SC_W || 320;

/**
 * @const
 */
var SC_H = SC_H || 320;

/**
 * @const
 */
var SC_ASPECT = SC_W / SC_H;

/**
 * @const
 */
var SC_ASPECT_INV = SC_H / SC_W;

/**
 * @const
 */
var IS_MOBILE = (window.navigator.userAgent.indexOf("iPhone") !== -1 || window.navigator.userAgent.indexOf("Android") !== -1);

HTMLCanvasElement.prototype.getContext2d = function(v) {
    v = !!v;
    var context = this.getContext("2d");
    if (context.hasOwnProperty("imageSmoothingEnabled")) {
        context.imageSmoothingEnabled = v;
    } else if (context.hasOwnProperty("mozImageSmoothingEnabled")) {
        context.mozImageSmoothingEnabled = v;
    } else if (context.hasOwnProperty("webkitImageSmoothingEnabled")) {
        context.webkitImageSmoothingEnabled = v;
    }
    return context;
};

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

/**
 * @class
 */
var Application = function(layerCount, mainLayerIndex) {
    window.document.body.style.background = "black";

    Application.INSTANCE = this;

    this.stats = null;
    if (window.location.host !== "r.jsgames.jp" && window["Stats"]) {
        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.left = '0px';
        this.stats.domElement.style.top = '0px';
        window.document.body.appendChild(this.stats.domElement);
    }

    var fill = window.document.createElement("div");
    window.document.body.appendChild(fill);
    fill.style.position = "absolute";
    fill.style.top = fill.style.left = 0;
    fill.style.cursor = "default";

    /**
     *
     */
    this.layerCount = layerCount || 1;
    /**
     *
     */
    this.mainLayerIndex = mainLayerIndex || 0;
    /**
     * @type Array.<HTMLCanvasElement>
     */
    this.layers = [];
    for (var i = 0; i < this.layerCount; i++) {
        this.addNewLayer();
    }

    this._canvasLeft = 0;
    this._canvasTop = 0;
    this._canvasScale = 0;

    // fit window
    var resize = function() {
        fill.style.width = window.innerWidth + "px";
        fill.style.height = window.innerHeight + "px";

        if (window.innerWidth / window.innerHeight < SC_ASPECT) {
            this._canvasLeft = 0;
            this._canvasTop = (window.innerHeight - (window.innerWidth * SC_ASPECT_INV)) * 0.5;
            this._canvasScale = SC_W / window.innerWidth;

            for (var i = 0; i < this.layerCount; i++) {
                var style = this.layers[i].style;
                style.width = window.innerWidth + "px";
                style.height = (window.innerWidth * SC_ASPECT_INV) + "px";
                style.left = this._canvasLeft + "px";
                style.top = this._canvasTop + "px";
            }
        } else {
            this._canvasLeft = (window.innerWidth - (window.innerHeight * SC_ASPECT)) * 0.5;
            this._canvasTop = 0;
            this._canvasScale = SC_H / window.innerHeight;

            for (var i = 0; i < this.layerCount; i++) {
                var style = this.layers[i].style;
                style.width = (window.innerHeight * SC_ASPECT) + "px";
                style.height = window.innerHeight + "px";
                style.left = this._canvasLeft + "px";
                style.top = this._canvasTop + "px";
            }
        }
    }.bind(this);
    resize();
    window.addEventListener("resize", resize, false);

    /**
     * @type CanvasRenderingContext2D
     */
    this.context = this.layers[this.mainLayerIndex].getContext2d();

    /**
     *
     */
    this.pointing = {
        isStart: false,
        isPointing: false,
        isEnd: false,
        x: 0,
        y: 0,
        beforeX: 0,
        beforeY: 0,
        deltaX: 0,
        deltaY: 0,
    };

    /**
     *
     */
    this.keyboard = {
        up: false,
        down: false,
        left: false,
        right: false,
        z: false,
        x: false,
        angles: {
        //  durl
              10: { x: Math.cos(Math.PI * 0.00), y: Math.sin(Math.PI * 0.00) },
            1010: { x: Math.cos(Math.PI * 0.25), y: Math.sin(Math.PI * 0.25) },
            1000: { x: Math.cos(Math.PI * 0.50), y: Math.sin(Math.PI * 0.50) },
            1001: { x: Math.cos(Math.PI * 0.75), y: Math.sin(Math.PI * 0.75) },
               1: { x: Math.cos(Math.PI * 1.00), y: Math.sin(Math.PI * 1.00) },
             101: { x: Math.cos(Math.PI * 1.25), y: Math.sin(Math.PI * 1.25) },
             100: { x: Math.cos(Math.PI * 1.50), y: Math.sin(Math.PI * 1.50) },
             110: { x: Math.cos(Math.PI * 1.75), y: Math.sin(Math.PI * 1.75) },
        },
        angle: function() {
            return this.angles[1000*this.down + 100*this.up + 10*this.right + 1*this.left];
        }
    };

    this._beforeTouching = false;
    this._touching = false;
    window.document.body.addEventListener("touchstart", function(ev) {
        // console.log("touchstart");
        var e = ev.touches[0];
        this._touching = true;
        if (e) {
            this.pointing.x = (e.clientX - this._canvasLeft) * this._canvasScale;
            this.pointing.y = (e.clientY - this._canvasTop) * this._canvasScale;
        }
        ev.preventDefault();
        ev.stopPropagation();
    }.bind(this), true);
    window.document.body.addEventListener("touchmove", function(ev) {
        // console.log("touchmove");
        var e = ev.touches[0];
        this._touching = true;
        if (e) {
            this.pointing.x = (e.clientX - this._canvasLeft) * this._canvasScale;
            this.pointing.y = (e.clientY - this._canvasTop) * this._canvasScale;
        }
        ev.preventDefault();
        ev.stopPropagation();
    }.bind(this), true);
    window.document.body.addEventListener("touchend", function(ev) {
        // console.log("touchend");
        var e = ev.touches[0];
        this._touching = false;
        if (e) {
            this.pointing.x = (e.clientX - this._canvasLeft) * this._canvasScale;
            this.pointing.y = (e.clientY - this._canvasTop) * this._canvasScale;
        }
        ev.preventDefault();
        ev.stopPropagation();
    }.bind(this), true);

    window.addEventListener("mousedown", function(e) {
        // console.log("mousedown");
        this._touching = true;
        this.pointing.x = (e.clientX - this._canvasLeft) * this._canvasScale;
        this.pointing.y = (e.clientY - this._canvasTop) * this._canvasScale;
        e.preventDefault();
        e.stopPropagation();
    }.bind(this), true);
    window.addEventListener("mousemove", function(e) {
        // console.log("mousemove");
        // this._touching = true;
        // if (this._touching) {
            this.pointing.x = (e.clientX - this._canvasLeft) * this._canvasScale;
            this.pointing.y = (e.clientY - this._canvasTop) * this._canvasScale;
        // }
        e.preventDefault();
        e.stopPropagation();
    }.bind(this), true);
    window.addEventListener("mouseup", function(e) {
        // console.log("mouseup ", e);
        this._touching = false;
        this.pointing.x = (e.clientX - this._canvasLeft) * this._canvasScale;
        this.pointing.y = (e.clientY - this._canvasTop) * this._canvasScale;
        e.preventDefault();
        e.stopPropagation();
    }.bind(this), true);
    window.addEventListener("click", function(e) {
        // console.log("click ", e);
        // TODO
        e.preventDefault();
        e.stopPropagation();
    }.bind(this), true);

    window.addEventListener("keydown", function(e) {
        switch (e.keyCode) {
        case 38:
            this.keyboard.up = true;
            break;
        case 37:
            this.keyboard.left = true;
            break;
        case 39:
            this.keyboard.right = true;
            break;
        case 40:
            this.keyboard.down = true;
            break;
        case 88:
            this.keyboard.x = true;
            break;
        case 90:
            this.keyboard.z = true;
            break;
        }
    }.bind(this), false);
    window.addEventListener("keyup", function(e) {
        switch (e.keyCode) {
        case 38:
            this.keyboard.up = false;
            break;
        case 37:
            this.keyboard.left = false;
            break;
        case 39:
            this.keyboard.right = false;
            break;
        case 40:
            this.keyboard.down = false;
            break;
        case 88:
            this.keyboard.x = false;
            break;
        case 90:
            this.keyboard.z = false;
            break;
        }
    }.bind(this), false);

    this.frame = 0;
    this.slowRate = 1.0;
    this.slowRateAdded = 0;

    /**
     * @type Scene
     */
    this.currentScene = new Scene();

    /**
     * @type Array.<Scene>
     */
    this.sceneStack = [ this.currentScene ];

    var render = function() {
        if (this.stats !== null) this.stats.update();

        this.update();
        this.draw();
        this.frame += 1;
        window.requestAnimationFrame(render);
    }.bind(this);
    window.requestAnimationFrame(render);
};

/**
 *
 */
Application.prototype.end = function() {
    // TODO
};

/**
 *
 */
Application.prototype.update = function() {
    this.slowRateAdded += this.slowRate;
    if (this.slowRateAdded < 1.0) return;

    this.slowRateAdded -= 1.0;

    var p = this.pointing;
    if (!this._beforeTouching && this._touching) {
        p.isStart = true;
        p.isPointing = false;
        p.isEnd = false;
        p.deltaX = 0;
        p.deltaY = 0;
    } else if (this._beforeTouching && this._touching) {
        p.isStart = false;
        p.isPointing = true;
        p.isEnd = false;
        p.deltaX = p.x - p.beforeX;
        p.deltaY = p.y - p.beforeY;
    } else if (this._beforeTouching && !this._touching) {
        p.isStart = false;
        p.isPointing = false;
        p.isEnd = true;
        p.deltaX = p.x - p.beforeX;
        p.deltaY = p.y - p.beforeY;
    } else {
        p.isStart = false;
        p.isPointing = false;
        p.isEnd = false;
        p.deltaX = p.x - p.beforeX;
        p.deltaY = p.y - p.beforeY;
    }
    this._beforeTouching = this._touching;

    if (this.currentScene) {
        var enterframeEvent = new Event("enterframe", {
            frame: this.frame
        });
        Object.freeze(enterframeEvent);
        this.currentScene._update(this, enterframeEvent);
    }

    p.beforeX = p.x;
    p.beforeY = p.y;
};
/**
 *
 */
Application.prototype.addNewLayer = function() {
    var layer = window.document.createElement("canvas");
    window.document.body.appendChild(layer);
    layer.style.position = "absolute";
    layer.width = SC_W;
    layer.height = SC_H;
    layer.style.cursor = "default";

    this.layers.push(layer);
};
/**
 *
 */
Application.prototype.draw = function() {
    this.context.clearRect(0, 0, SC_W, SC_H);
    for (var i = 0, len = this.sceneStack.length; i < len; i++) {
        this.sceneStack[i]._draw(this.context);
    }
};
/**
 * @param {Scene} scene
 */
Application.prototype.replaceScene = function(scene) {
    if (this.currentScene) {
        this.currentScene.app = null;
        // this.currentScene.onexit();
        this.currentScene.flare("exit");
    }

    this.sceneStack.pop();
    this.sceneStack.push(scene);

    this.currentScene = scene;
    this.currentScene.app = this;

    // this.currentScene.onenter();
    this.currentScene.flare("enter");
};
/**
 * @param {Scene} scene
 */
Application.prototype.pushScene = function(scene) {
    if (this.sceneStack.length > 0) {
        // this.sceneStack[this.sceneStack.length - 1].onexit();
        this.sceneStack[this.sceneStack.length - 1].flare("exit");
    }
    this.sceneStack.push(scene);
    scene.app = this;
    this.currentScene = scene;
    // scene.onenter();
    scene.flare("enter");
};
/**
 *
 */
Application.prototype.popScene = function() {
    var scene = this.sceneStack.pop();
    if (scene) {
        // scene.onexit();
        scene.flare("exit");
        scene.app = null;
        if (this.sceneStack.length > 0) {
            this.currentScene = this.sceneStack[this.sceneStack.length - 1];
            // this.currentScene.onenter();
            this.currentScene.flare("enter");
        } else {
            this.currentScene = null;
        }
    }
};

Application.INSTANCE = null;

/**
 * @class
 * @extends EventDispatcher
 */
var Node = function() {
    EventDispatcher.call(this);

    /**
     *
     */
    this.parent = null;

    /**
     *
     */
    this.children = [];

    /**
     *
     */
    this.frame = 0;

    /**
     *
     */
    this.visible = true;
};
Node.prototype = Object.create(EventDispatcher.prototype);


/**
 * @param {Node} child
 */
Node.prototype.addChild = function(child) {
    child.parent = this;
    this.children.push(child);
    // child.onadded();
    child.flare("added");
};
/**
 * @param {Node} parent
 */
Node.prototype.addChildTo = function(parent) {
    parent.addChild(this);
    return this;
};
/**
 * @param {Node} child
 */
Node.prototype.removeChild = function(child) {
    var idx = this.children.indexOf(child);
    if (idx >= 0) {
        child.parent = null;
        this.children.splice(idx, 1);
        // child.onremoved();
        child.flare("removed");
    }
};
/**
 *
 */
Node.prototype.remove = function() {
    if (this.parent !== null) this.parent.removeChild(this);
    return this;
};
/**
 * @private
 * @param {Application} app
 * @param {Event} enterframeEvent
 */
Node.prototype._update = function(app, enterframeEvent) {
    if (this.update(app) === true) return;

    var copied = [].concat(this.children);
    for (var i = 0, len = copied.length; i < len; i++) {
        copied[i]._update(app);
    }

    this.fire(enterframeEvent);

    this.frame += 1;
};
/**
 * @private
 * @param {CanvasRenderingContext2D} context
 */
Node.prototype._draw = function(context) {
    context.save();
    if (this.visible) {
        this.predraw(context);
        this.draw(context);
        for (var i = 0, len = this.children.length; i < len; i++) {
            this.children[i]._draw(context);
        }
    }
    context.restore();
};
/**
 * @param {Application} app
 */
Node.prototype.update = function(app) {};
/**
 * @param {CanvasRenderingContext2D} context
 */
Node.prototype.predraw = function(context) {};
/**
 * @param {CanvasRenderingContext2D} context
 */
Node.prototype.draw = function(context) {};
/**
 *
 */
Node.prototype.onadded = function() {};
/**
 *
 */
Node.prototype.onremoved = function() {};

var Object2d = function() {
    Node.call(this);
    /**
     *
     */
    this.width = 0;
    /**
     *
     */
    this.height = 0;

    /**
     *
     */
    this.x = 0.0;
    /**
     *
     */
    this.y = 0.0;
    /**
     *
     */
    this.rotation = 0.0;
    /**
     *
     */
    this.scaleX = 1.0;
    /**
     *
     */
    this.scaleY = 1.0;

    /**
     *
     */
    this.originX = 0.5;

    /**
     *
     */
    this.originY = 0.5;
};
Object2d.prototype = Object.create(Node.prototype);

/**
 *
 */
Object2d.prototype.predraw = function(context) {
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.scale(this.scaleX, this.scaleY);
};

/**
 *
 */
Object2d.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
};

/**
 *
 */
Object2d.prototype.setOrigin = function(x, y) {
    this.originX = x;
    this.originY = y;
    return this;
};

/**
 *
 */
Object2d.prototype.setScale = function(x, y) {
    if (arguments.length === 1) y = x;
    this.scaleX = x;
    this.scaleY = y;
    return this;
};

/**
 *
 */
Object2d.prototype.setRotation = function(r) {
    this.rotation = r;
    return this;
};

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

/**
 * @class
 * @param {HTMLCanvasElement} canvas
 */
var Layer = function(canvas, drawRate) {
    Node.call(this);

    this.canvas = canvas;
    canvas.width = SC_W;
    canvas.height = SC_H;

    this.context = canvas.getContext2d();

    this.drawRate = drawRate;
};
Layer.prototype = Object.create(Node.prototype);
/**
 * @private
 */
Layer.prototype._draw = function() {
    if (this.frame % this.drawRate !== 0) return;

    this.context.clearRect(0, 0, SC_W, SC_H);
    this.context.save();
    this.draw(this.context);
    for (var i = 0, len = this.children.length; i < len; i++) {
        this.children[i]._draw(this.context);
    }
    this.context.restore();
};

/**
 * @class
 * @extends Node
 */
var Scene = function() {
    Node.call(this);
    this.app = null;
};
Scene.prototype = Object.create(Node.prototype);
/**
 *
 */
Scene.prototype.onenter = function() {};
/**
 *
 */
Scene.prototype.onexit = function() {};

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
    for (var name in assets) if (assets.hasOwnProperty(name)) {
        var ext = assets[name].match(/\.\w+/);
        if (ext) {
            switch (ext[0]) {
            case ".mp3":
                this._loadAudio(name, assets[name]);
                break;
            case ".ttf":
                this._loadFont(name, assets[name]);
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

/**
 * @class
 */
var Xhr = function(param) {
    this.param = param;
    var that = this;
    var xhr = this.xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200 || this.status === 201) {
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
    console.debug("jsonp send");
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

/**
 * @class
 */
var Sound = function(data) {
    this.buffer = null;
    this.source = null;
    this.gainNode = null;

    if (Sound.CONTEXT !== null) {
        if (data instanceof ArrayBuffer) {
            Sound.CONTEXT.decodeAudioData(data, function(buffer) {
                this.buffer = buffer;
                this.source = Sound.CONTEXT.createBufferSource();
                this.source.buffer = this.buffer;
                this.gainNode = Sound.CONTEXT.createGain();
                this.source.connect(this.gainNode);
                this.gainNode.connect(Sound.CONTEXT.destination);

                this.onload();
            }.bind(this));
        } else if (data instanceof AudioBuffer) {
            this.buffer = data;
            this.source = Sound.CONTEXT.createBufferSource();
            this.source.buffer = this.buffer;
            this.gainNode = Sound.CONTEXT.createGain();
            this.source.connect(this.gainNode);
            this.gainNode.connect(Sound.CONTEXT.destination);

            this.onload();
        }
    } else {
        throw new Error("webkitAudioContext is not defined.");
    }
};
Sound.prototype = Object.create(Object.prototype, {
    volume: {
        get: function() { return this.gainNode.gain.value },
        set: function(v) { this.gainNode.gain.value = v },
    },
    loop: {
        get: function() { return this.source.loop },
        set: function(v) { this.source.loop = v },
    },
    loopStart: {
        get: function() { return this.source.loopStart },
        set: function(v) { this.source.loopStart = v },
    },
    loopEnd: {
        get: function() { return this.source.loopEnd },
        set: function(v) { this.source.loopEnd = v },
    }
});

Sound.prototype.onload = function() {};
/**
 *
 */
Sound.prototype.start = function() {
    this.source.start(0);
};
/**
 *
 */
Sound.prototype.play = Sound.prototype.start;
/**
 *
 */
Sound.prototype.stop = function() {
    this.source.stop(0);
    this.source.disconnect();
    var volume = this.gainNode.gain.value;
    this.source = Sound.CONTEXT.createBufferSource();
    this.gainNode.gain.value = volume;
    this.source.buffer = this.buffer;
    this.source.connect(Sound.CONTEXT.destination);
};
/**
 *
 */
Sound.prototype.clone = function() {
    var clone = new Sound(this.buffer);
    clone.volume = this.volume;
    clone.loop = this.loop;
    clone.loopStart = this.loopStart;
    clone.loopEnd = this.loopEnd;
    return clone;
};

/**
 *
 */
Sound.CONTEXT = null;
if (window.webkitAudioContext) {
    Sound.CONTEXT = new webkitAudioContext();
} else if (window.mozAudioContext) {
    Sound.CONTEXT = new mozAudioContext();
} else if (window.AudioContext) {
    Sound.CONTEXT = new AudioContext();
}

/**
 * @class
 */
var SoundEngine = {};

/**
 *
 */
SoundEngine.bgm = null;
/**
 *
 */
SoundEngine.bgmName = null;
/**
 *
 */
SoundEngine.playing = {};
/**
 *
 */
SoundEngine.playSE = function(name) {
    if (Assets[name]) {
        if (SoundEngine.playing[name] === Application.INSTANCE.frame) return;

        SoundEngine.playing[name] = Application.INSTANCE.frame;
        var se = Assets[name].clone();
        se.volume = OptionSettings.seVolume;
        se.start();
    }
};
/**
 *
 */
SoundEngine.startBgm = function(name) {
    if (SoundEngine.bgmName === name) return;

    SoundEngine.stopBgm();

    if (Assets[name]) {
        SoundEngine.bgmName = name;
        SoundEngine.bgm = Assets[name].clone();
        SoundEngine.bgm.loop = true;
        SoundEngine.bgm.volume = OptionSettings.bgmVolume;
        SoundEngine.bgm.start();
    }
};
/**
 *
 */
SoundEngine.stopBgm = function() {
    if (SoundEngine.bgm) {
        SoundEngine.bgm.stop();
        SoundEngine.bgm = null;
        SoundEngine.bgmName = null;
    }
};

/**
 * @class
 * @extends Object2d
 * @param {HTMLCanvasElement} texture
 */
var Sprite = function(texture) {
    Object2d.call(this);

    /**
     *
     */
    this.texture = texture;
    /**
     *
     */
    this.width = texture.width;
    /**
     *
     */
    this.height = texture.height;

    /**
     *
     */
    this.alpha = 1.0;

    /**
     *
     */
    this.blendMode = "lighter";
};
Sprite.prototype = Object.create(Object2d.prototype);
Sprite.prototype.draw = function(context) {
    context.globalAlpha = this.alpha;
    context.globalCompositeOperation = this.blendMode;

    context.drawImage(this.texture, -this.width * this.originX, -this.height * this.originY);
};

/**
 *
 */
Sprite.prototype.isHitPoint = function(point) {
    var w = (this.width*this.scaleX)*0.5;
    var h = (this.height*this.scaleY)*0.5;
    return this.x - w <= point.x && point.x < this.x + w && this.y - h <= point.y && point.y < this.y + h;
};

/**
 *
 */
Sprite.prototype.setAlpha = function(alpha) {
    this.alpha = alpha;
    return this;
};
/**
 * @class
 * @extends Sprite
 */
var Rect = function(color, width, height) {
    var texture = new Canvas(width, height)
        .set({ color: color })
        .drawRect(2, 2, width-4, height-4)
        .toTexture();

    Sprite.call(this, texture);
};
Rect.prototype = Object.create(Sprite.prototype);

/**
 * @class
 * @extends Sprite
 */
var RoundRect = function(color, width, height) {
    var texture = new Canvas(width, height)
        .set({ color: color })
        .drawRoundRect(2, 2, width-4, height-4)
        .toTexture();

    Sprite.call(this, texture);
};
RoundRect.prototype = Object.create(Sprite.prototype);

/**
 * @class
 * @extends Sprite
 */
var Circle = function(color, radius) {
    this.radius = radius;

    var texture = new Canvas(radius*2, radius*2)
        .set({ color: color })
        .drawCircle(radius, radius, radius-2)
        .toTexture();

    Sprite.call(this, texture);
};
Circle.prototype = Object.create(Sprite.prototype);

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

/**
 * @class
 * @extends Sprite
 */
var Fighter = function(color, w, h) {
    var canvas = new Canvas(w, h);
    var context = canvas.context;

    Util.setStyle(context, 220);

    context.beginPath();
    context.moveTo(w*0.35, h*0.4);
    context.lineTo(w*0.4, h*0.8);
    context.lineTo(w*0.2, h*0.9);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(w*0.65, h*0.4);
    context.lineTo(w*0.8, h*0.9);
    context.lineTo(w*0.6, h*0.8);
    context.closePath();
    context.fill();
    context.stroke();

    context.beginPath();
    context.moveTo(w*0.5, h*0.1);
    context.lineTo(w*0.65, h*0.7);
    context.lineTo(w*0.35, h*0.7);
    context.closePath();
    context.fill();
    context.stroke();

    Sprite.call(this, canvas.toTexture());
};
Fighter.prototype = Object.create(Sprite.prototype);

/**
 * @class
 * @extends Node
 */
var Label = function(text, fontSize, color) {
    this.x = 0.0;
    this.y = 0.0;
    this.rotation = 0.0;
    this.scaleX = 1.0;
    this.scaleY = 1.0;
    this.alpha = 1.0;

    this._text = text;
    this._fontSize = fontSize || 24;
    this._fontFamily = Label.DEFAULT_FONT;
    this.setColor(color || 0);

    var texture = this.updateText();
    Sprite.call(this, texture);
};
Label.prototype = Object.create(Sprite.prototype, {
    text: {
        get: function() { return this._text },
        set: function(v) {
            this.setText(v);
        },
    },
    fontSize: {
        get: function() { return this._fontSize },
        set: function(v) {
            this.setFontSize(v);
        },
    },
    fontFamily: {
        get: function() { return this._fontFamily },
        set: function(v) {
            this.setFontFamily(v);
        },
    },
});
/**
 *
 */
Label.prototype.setColor = function(color) {
    // Util.setStyle(this, color);
    this.fillStyle = "hsla(" + color + ", 50%, 80%, 1.0)";
};
/**
 *
 */
Label.prototype.setText = function(text) {
    this._text = text;
    this.texture = this.updateText();
    this.width = this.texture.width;
    this.height = this.texture.height;
};
/**
 *
 */
Label.prototype.setFontSize = function(fontSize) {
    this._fontSize = fontSize;
    this.texture = this.updateText();
    this.width = this.texture.width;
    this.height = this.texture.height;
};
/**
 *
 */
Label.prototype.setFontFamily = function(fontSize) {
    this._fontFamily = fontFamily;
    this.texture = this.updateText();
    this.width = this.texture.width;
    this.height = this.texture.height;
};
/**
 *
 */
Label.prototype.updateText = function() {
    var c = window.document.createElement("canvas");
    var ctx = c.getContext2d(true);

    ctx.font = "" + this._fontSize + "px '" + this._fontFamily + "'";

    var metrics = ctx.measureText(this._text);
    c.width = metrics.width + 5;
    c.height = this._fontSize;

    ctx.font = "" + this._fontSize + "px '" + this._fontFamily + "'";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = this.fillStyle;
    // ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 2;

    ctx.fillText(this._text, c.width*0.5, c.height*0.5);
    // ctx.strokeText(this._text, c.width*0.5, c.height*0.5);

    return c;
};

Label.DEFAULT_FONT = "sans-serif";

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

/**
 * @class
 */
var Util = {
    /**
     *
     */
    style: function(color) {
        return {
            fillStyle: "hsla(" + color + ", 80%, 20%, 0.5)",
            strokeStyle: "hsla(" + color + ", 50%, 80%, 1.0)",
            lineWidth: 2,
        };
    },
    /**
     *
     */
    setStyle: function(target, color) {
        var style = this.style(color);
        target.fillStyle = style.fillStyle;
        target.strokeStyle = style.strokeStyle;
        target.lineWidth = style.lineWidth;
    },
    /**
     *
     */
    linearGradient: function(x0, y0, x1, y1, colorStops) {
        var ctx = window.document.createElement("canvas").getContext2d();
        var result = ctx.createLinearGradient(x0, y0, x1, y1);
        for (var i = 0; i < colorStops.length; i++) {
            result.addColorStop(colorStops[i].offset, colorStops[i].color);
        }
        return result;
    },
    /**
     *
     */
    radialGradient: function(x0, y0, r0, x1, y1, r1, colorStops) {
        var ctx = window.document.createElement("canvas").getContext2d();
        var result = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
        for (var i = 0; i < colorStops.length; i++) {
            result.addColorStop(colorStops[i].offset, colorStops[i].color);
        }
        return result;
    },
    /**
     *
     */
    range: function(from, to) {
        var result = [];
        for (var i = from; i < to; i++) {
            result.push(i);
        }
        return result;
    },
    /**
     *
     */
    curry: function(f) {
        return function _curry(xs) {
            return xs.length < f.length ? function(x) { return _curry(xs.concat([x])); } : f.apply(undefined, xs);
        }([]);
    },
    /**
     *
     */
    rand: function(min, max) {
        return min + Math.random() * (max - min);
    },
    /**
     *
     */
    randi: function(min, max) {
        return parseInt(min + Math.random() * (max - min));
    },
    /**
     *
     */
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(value, max));
    },
};

/**
 *
 */
var Http = {

    queryParameter: function(data) {
        var result = "";
        var first = true;
        for (var key in data) if (data.hasOwnProperty(key)) {
            if (!first) result += "&";
            result += encodeURI(key) + "=" + encodeURI(data[key]);
            first = false;
        }
        return result;
    }

};

/**
 * @class
 * @extends Node
 */
var Tweener = function(target) {
    Node.call(this);

    this.target = target;
    this.actions = [];
    this.actionPointer = 0;
    this.loop = false;

    this.addChildTo(target);
};
Tweener.prototype = Object.create(Node.prototype);
Tweener.prototype.update = function(app) {
    var action = this.actions[this.actionPointer];
    if (action !== undefined) {
        if (action.currentPos < 0) {
            action.initialize(this.target);
        }
        if (action.update(this.target)) {
            this.actionPointer += 1;
            if (this.actions.length === this.actionPointer) {
                if (this.loop) {
                    this.actionPointer = 0;
                } else {
                    this.remove();
                }
            }
        }
    }
};
/**
 *
 */
Tweener.prototype.add = function(action) {
    this.actions.push(action);
    return this;
};
/**
 *
 */
Tweener.prototype.to = function(params, time, ease) {
    return this.add(new TweenAction(params, time, ease));
};
/**
 *
 */
Tweener.prototype.moveTo = function(x, y, time, ease) {
    return this.to({
        x: x,
        y: y
    }, time, ease);
};
/**
 *
 */
Tweener.prototype.wait = function(frame) {
    return this.add(new Action(frame));
};
/**
 *
 */
Tweener.prototype.then = function(func) {
    return this.add(new CallAction(func));
};
/**
 *
 */
Tweener.prototype.setLoop = function(loop) {
    this.loop = loop;
    return this;
};

/**
 * @class
 */
var Action = function(time) {
    this.time = time;
    this.currentPos = -1;
};
/**
 *
 */
Action.prototype.initialize = function(target) {
    this.currentPos = 0;
};
/**
 *
 */
Action.prototype.update = function(target) {
    this.currentPos += 1;
    if (this.currentPos === this.time) {
        this.finalize(target);
    }
    return this.currentPos >= this.time;
};
/**
 *
 */
Action.prototype.finalize = function(target) {
};
/**
 * @class
 * @extends Action
 */
var CallAction = function(func) {
    Action.call(this, 0);
    this.func = func;
};
CallAction.prototype = Object.create(Action.prototype);
CallAction.prototype.update = function(target) {
    if (this.func) {
        this.func.call(target);
    }
    return Action.prototype.update.call(this, target);
};

/**
 * @class
 * @extends Action
 */
var TweenAction = function(param, time, ease) {
    Action.call(this, time);

    this.param = param;
    this.ease = ease || function(pos) { return pos };

    this.initials = {};
    this.deltas = {};
};
TweenAction.prototype = Object.create(Action.prototype);
TweenAction.prototype.initialize = function(target) {
    Action.prototype.initialize.call(this, target);

    for (var key in this.param) {
        this.initials[key] = target[key];
        this.deltas[key] = this.param[key] - target[key];
    }
};
TweenAction.prototype.update = function(target) {
    var p = this.ease(this.currentPos / this.time);
    for (var key in this.param) {
        target[key] = this.initials[key] + this.deltas[key] * p;
    }
    return Action.prototype.update.call(this, target);
};
TweenAction.prototype.finalize = function(target) {
    for (var key in this.param) {
        target[key] = this.param[key];
    }
}
/**
 *
 */
var Canvas = function(width, height) {
    this.canvas = window.document.createElement("canvas");
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
    this.context = this.canvas.getContext2d();
};

/**
 *
 */
Canvas.prototype.set = function(params) {
    var c = this.context;
    if (params.color !== undefined) {
        Util.setStyle(c, params.color);
    } else {
        c.fillStyle = params.fillStyle || "red";
        c.strokeStyle = params.strokeStyle || "white";
        c.lineWidth = params.lineWidth || 2;
    }
    return this;
};

/**
 *
 */
Canvas.prototype.toTexture = function() {
    return this.canvas;
};

/**
 *
 */
Canvas.prototype.fillRect = function(x, y, w, h) {
    this.context.fillRect(x, y, w, h);
    return this;
};

/**
 *
 */
Canvas.prototype.drawRect = function(x, y, w, h) {
    this.context.fillRect(x, y, w, h);
    this.context.strokeRect(x, y, w, h);
    return this;
};

/**
 *
 */
Canvas.prototype.drawRoundRect = function(x, y, w, h, r) {
    r = r || 10;

    var c = this.context;
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r);
    c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h);
    c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r);
    c.arcTo(x, y, x + r, y, r);
    c.closePath();
    c.fill();
    c.stroke();
    return this;
};

/**
 *
 */
Canvas.prototype.drawCircle = function(x, y, r) {
    this.context.arc(x, y, r, 0, Math.PI*2, false);
    this.context.fill();
    this.context.stroke();
    return this;
};

/**
 *
 */
Canvas.prototype.drawPolygon = function(x, y, r, sides, offset) {
    offset = offset || 0;

    this.context.beginPath();
    this.context.moveTo(x + Math.cos(offset) * r, y + Math.sin(offset) * r);
    for (var i = 1; i < sides; i++) {
        var a = offset + Math.PI*2 * i / sides;
        this.context.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
};

/**
 *
 */
Canvas.prototype.drawLines = function(vertices) {
    this.context.beginPath();
    this.context.moveTo(arguments[0][0], arguments[0][1]);
    for (var i = 1; i < arguments.length; i++) {
        this.context.lineTo(arguments[i][0], arguments[i][1]);
    }
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
};

/**
 *
 */
Canvas.prototype.drawImage = function(img, x, y) {
    this.context.drawImage.apply(this.context, arguments);
};

(function() {

// StackBlur - a fast almost Gaussian Blur For Canvas

// Version:    0.5
// Author:     Mario Klingemann
// Contact:    mario@quasimondo.com
// Website:    http://www.quasimondo.com/StackBlurForCanvas
// Twitter:    @quasimondo

/**
 *
 */
Canvas.prototype.stackBlur = function(radius) {
    var width = this.width;
    var height = this.height;
    var canvas  = this.canvas;
    var context = this.context;

    if ( isNaN(radius) || radius < 1 ) return;
    radius |= 0;
    
    var imageData;
    
    try {
      try {
        imageData = context.getImageData( 0, 0, width, height );
      } catch(e) {
      
        // NOTE: this part is supposedly only needed if you want to work with local files
        // so it might be okay to remove the whole try/catch block and just use
        // imageData = context.getImageData( 0, 0, width, height );
        try {
            netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
            imageData = context.getImageData( 0, 0, width, height );
        } catch(e) {
            alert("Cannot access local image");
            throw new Error("unable to access local image data: " + e);
            return;
        }
      }
    } catch(e) {
      alert("Cannot access image");
      throw new Error("unable to access image data: " + e);
    }
            
    var pixels = imageData.data;
            
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
    r_out_sum, g_out_sum, b_out_sum, a_out_sum,
    r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
    pr, pg, pb, pa, rbs;
            
    var div = radius + radius + 1;
    var w4 = width << 2;
    var widthMinus1  = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1  = radius + 1;
    var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
    
    var stackStart = new BlurStack();
    var stack = stackStart;
    for ( i = 1; i < div; i++ )
    {
        stack = stack.next = new BlurStack();
        if ( i == radiusPlus1 ) var stackEnd = stack;
    }
    stack.next = stackStart;
    var stackIn = null;
    var stackOut = null;
    
    yw = yi = 0;
    
    var mul_sum = mul_table[radius];
    var shg_sum = shg_table[radius];
    
    for ( y = 0; y < height; y++ )
    {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        
        r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
        a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        
        for( i = 1; i < radiusPlus1; i++ )
        {
            p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
            r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
            a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
            
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            
            stack = stack.next;
        }
        
        
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( x = 0; x < width; x++ )
        {
            pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
            if ( pa != 0 )
            {
                pa = 255 / pa;
                pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
                pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
            } else {
                pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
            }
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            
            p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
            
            r_in_sum += ( stackIn.r = pixels[p]);
            g_in_sum += ( stackIn.g = pixels[p+1]);
            b_in_sum += ( stackIn.b = pixels[p+2]);
            a_in_sum += ( stackIn.a = pixels[p+3]);
            
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            a_out_sum += ( pa = stackOut.a );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            
            stackOut = stackOut.next;

            yi += 4;
        }
        yw += width;
    }

    
    for ( x = 0; x < width; x++ )
    {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        
        yi = x << 2;
        r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
        g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
        b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
        a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
        
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        
        stack = stackStart;
        
        for( i = 0; i < radiusPlus1; i++ )
        {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        
        yp = width;
        
        for( i = 1; i <= radius; i++ )
        {
            yi = ( yp + x ) << 2;
            
            r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
            g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
            b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
            a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
           
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            
            stack = stack.next;
        
            if( i < heightMinus1 )
            {
                yp += width;
            }
        }
        
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for ( y = 0; y < height; y++ )
        {
            p = yi << 2;
            pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
            if ( pa > 0 )
            {
                pa = 255 / pa;
                pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
                pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
                pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
            } else {
                pixels[p] = pixels[p+1] = pixels[p+2] = 0;
            }
            
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
           
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            
            p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
            
            r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
            g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
            b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
            a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
           
            stackIn = stackIn.next;
            
            r_out_sum += ( pr = stackOut.r );
            g_out_sum += ( pg = stackOut.g );
            b_out_sum += ( pb = stackOut.b );
            a_out_sum += ( pa = stackOut.a );
            
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            
            stackOut = stackOut.next;
            
            yi += width;
        }
    }
    
    context.putImageData( imageData, 0, 0 );

    return this;
};

var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
         9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
        17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
        19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
        21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
        22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
        23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
        23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
        24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function BlurStack()
{
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
})();

/**
 * @class
 */
var NineleapUtil = {
    /**
     *
     */
    gotoLogin: function() {
        window.location.replace("http://9leap.net/api/login");
    },

    /**
     *
     */
    isOn9leap: function() {
        return window.location.hostname === "r.jsgames.jp";
    },

    /**
     *
     */
    scoreEntry: function(score, result) {
        if (NineleapUtil.isOn9leap()) {
            var id = window.location.pathname.match(/^\/games\/(\d+)/)[1];
            window.location.replace([
                "http://9leap.net/games/", id, "/result",
                "?score=", window.encodeURIComponent(score),
                "&result=", window.encodeURIComponent(result)
            ].join(""));
        } else {
            window.location.replace(window.location.href);
        }
    },

    /**
     *
     */
    getGameId: function() {
        if (NineleapUtil.isOn9leap()) {
            return window.location.pathname.match(/^\/games\/(\d+)/)[1];
        } else {
            return NineleapUtil.DEBUG_GAME_ID;
        }
    },

    /**
     *
     */
    getMyData: function(callback) {
        console.debug("NineleapUtil.getMyData");
        var jsonp = new Jsonp({
            url: NineleapUtil.createMyDataURL()
        });
        jsonp.onsuccess = function(data) {
            console.debug("NineleapUtil.getMyData success", data);
            callback(null, data);
        };
        jsonp.onerror = function(error) {
            callback(error);
        };
        jsonp.send();
    },

    /**
     *
     */
    postMyData: function(data, callback) {
        var xhr = new Xhr({
            type: "POST",
            url: NineleapUtil.createURL("user_memory.json"),
            data: "json=" + JSON.stringify(data),
            withCredentials: true,
            requestHeader: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            async: false,
        });
        xhr.onsuccess = function(xhr) {
            console.info("postMyData success.");
            if (callback) callback(null);
        };
        xhr.onerror = function(xhr) {
            console.error("error at NineleapUtil.postMyData", xhr);
            if (callback) callback(new Error(xhr));
        };
        xhr.send();
    },

    /**
     *
     */
    deleteMyData: function(callback) {
        NineleapUtil.postMyData(null, callback);
    },

    /**
     *
     */
    createURL: function() {
        var url = [
            "http://9leap.net/api/memory/",
            NineleapUtil.getGameId() + "/",
        ];
        for (var i = 0, len = arguments.length; i < len; i++) {
            url.push(arguments[i]);
        }

        return url.join("");
    },
    /**
     *
     */
    createMyDataURL: function() {
        return NineleapUtil.createURL("user_memory.json");
    },
    /**
     *
     */
    createUserDataURL: function(screenName) {
        return NineleapUtil.createURL("u/", screenName + ".json");
    },
    /**
     *
     */
    createRecentDataURL: function(max) {
        max = max || 30;
        return NineleapUtil.createURL("recent_memories.json", "?max=" + max);
    },
    /**
     *
     */
    createFriendDataURL: function(max) {
        max = max || 30;
        return NineleapUtil.createURL("friends_memories.json", "?max=" + max);
    },
    /**
     *
     */
    createRankingDataURL: function(max) {
        max = max || 30;
        return NineleapUtil.createURL("ranking_memories.json", "?max=" + max);
    },
};

NineleapUtil.DEBUG_GAME_ID = "1888";

/**
 *
 */
var Loading = function() {
    Object2d.call(this);

    this.setPosition(SC_W * 0.5, SC_H * 0.5);

    this.bg = new Object2d()
        .addChildTo(this);
    this.bg.draw = function(context) {
        context.globalCompositeOperation = "source-over";
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(-SC_W, -SC_H, SC_W*2, SC_H*2);
    };

    new Label("loading...", 20, 200).addChildTo(this);

    var r = 0;
    for (var i = 0; i < 12; i++) {
        new Rect(i * 30, 20, 20)
            .setPosition(Math.cos(r) * 50, Math.sin(r) * 50)
            .addChildTo(this.bg)
            .update = function() {
                this.rotation += 0.1;
            };

        r += Math.PI * 2 / 12;
    }
};
Loading.prototype = Object.create(Object2d.prototype);
Loading.prototype.update = function(app) {
    this.bg.rotation += 0.03;
    this.scaleX = this.scaleY = 1.0 + Math.sin(app.frame * 0.1) * 0.2;
};

/**
 * @class
 * @extends Node
 */
var Explosion = function(x, y, size) {
    Node.call(this);
    this.x = x;
    this.y = y;
    this.dirCount = 5;
    this.spdRate = size || 1;
    this.particleClass = ExplosionPerticle;
};
Explosion.prototype = Object.create(Node.prototype);
Explosion.prototype.update = function() {
    if (this.children.length === 0) this.remove();
}
Explosion.prototype.onadded = function() {
    for (var i = 0; i < this.dirCount; i++) {
        var v = Explosion.VEL[parseInt(Math.random() * Explosion.VEL.length)];
        var s = this.speed();
        for (var j = 0; j < 5; j++) {
            var p = new this.particleClass();
            if (p) {
                p.x = this.x;
                p.y = this.y;
                p.scaleX = p.scaleY = 1 + (5-j)*0.2;
                p.vx = v.x * (1+j)*s;
                p.vy = v.y * (1+j)*s;
                p.addChildTo(this);
            }
        }
    }
};
Explosion.prototype.speed = function() {
    return 0.8 + Math.random() * 1.2 * this.spdRate;
};
Explosion.VEL = Util.range(0, 16).map(function(v) {
    return {
        x: Math.cos(Math.PI*2 * v/16),
        y: Math.sin(Math.PI*2 * v/16)
    };
});
Explosion.addTarget = null;

/**
 *
 */
var ExplosionPerticle = function() {
    Sprite.call(this, ExplosionPerticle.TEXTURE);
    this.alpha = 0.5;
    this.vx = 0;
    this.vy = 0;
};
ExplosionPerticle.prototype = Object.create(Sprite.prototype);
ExplosionPerticle.prototype.update = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.alpha -= 0.01;
    if (this.alpha < 0) this.remove();
};
ExplosionPerticle.TEXTURE = (function() {
    return new Rect(10, 20, 20).texture;
})();

