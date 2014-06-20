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
            return "1888";
        }
    },

    /**
     *
     */
    getMyData: function(callback) {
        var jsonp = new Jsonp({
            url: NineleapUtil.createMyDataURL()
        });
        jsonp.onsuccess = function(data) {
            callback(data);
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
            data: JSON.stringify(data),
        });
        xhr.onsuccess = function() {
            callback(null);
        };
        xhr.onerror = function(xhr) {
            callback(new Error(xhr));
        };
        xhr.send();
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
