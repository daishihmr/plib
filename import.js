var importPlib = function(dir) {
    dir = arguments.length > 0 ? "plib/src" : dir;

    var addScriptElement = function(src) {
        var s = document.createElement("script");
        s.src = src;
        document.body.appendChild(s);
    };

    addScriptElement(dir + "/_pre.js");
    addScriptElement(dir + "/application.js");
    addScriptElement(dir + "/node.js");
    addScriptElement(dir + "/menu.js");
    addScriptElement(dir + "/layer.js");
    addScriptElement(dir + "/scene.js");
    addScriptElement(dir + "/assetloadscene.js");
    addScriptElement(dir + "/xhr.js");
    addScriptElement(dir + "/jsonp.js");
    addScriptElement(dir + "/sound.js");
    addScriptElement(dir + "/soundengine.js");
    addScriptElement(dir + "/sprite.js");
    addScriptElement(dir + "/rect.js");
    addScriptElement(dir + "/circle.js");
    addScriptElement(dir + "/polygon.js");
    addScriptElement(dir + "/randompolygon.js");
    addScriptElement(dir + "/label.js");
    addScriptElement(dir + "/util.js");
    addScriptElement(dir + "/tweener.js");
    addScriptElement(dir + "/action.js");
    addScriptElement(dir + "/callaction.js");
    addScriptElement(dir + "/tweenaction.js");
    addScriptElement(dir + "/canvas.js");
    addScriptElement(dir + "/nineleaputil.js");

};
