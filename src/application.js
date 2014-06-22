/**
 * @class
 */
var Application = function(layerCount, mainLayerIndex) {
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

    if (this.currentScene) this.currentScene._update(this);

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
        this.currentScene.onexit();
    }

    this.sceneStack.pop();
    this.sceneStack.push(scene);

    this.currentScene = scene;
    this.currentScene.app = this;

    this.currentScene.onenter();
};
/**
 * @param {Scene} scene
 */
Application.prototype.pushScene = function(scene) {
    if (this.sceneStack.length > 0) {
        this.sceneStack[this.sceneStack.length - 1].onexit();
    }
    this.sceneStack.push(scene);
    scene.app = this;
    this.currentScene = scene;
    scene.onenter();
};
/**
 *
 */
Application.prototype.popScene = function() {
    var scene = this.sceneStack.pop();
    if (scene) {
        scene.onexit();
        scene.app = null;
        if (this.sceneStack.length > 0) {
            this.currentScene = this.sceneStack[this.sceneStack.length - 1];
            this.currentScene.onenter();
        } else {
            this.currentScene = null;
        }
    }
};

Application.INSTANCE = null;
