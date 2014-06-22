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
