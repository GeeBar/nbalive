var request = require("request");
var HUPU_SERVER = require("./config").HUPU_REMOTE_SERVER;
var SERVER = require("./config").REMOTE_SERVER;
var SM_SERVER = require("./config").SM_REMOTE_SERVER;
var queryString = require("querystring");
var objToQuery = function (obj) {
    var qs = queryString.stringify(obj);
    return qs ? "?" + qs : "";
};
var NOOP = function () {
};

exports.hupu_api = function (options) {
    if (!options.url) {
        return;
    }
    var onSuc = options.onSuc || NOOP;
    var onError = options.onError || NOOP;

    var url = HUPU_SERVER + options.url + objToQuery(options.data);
    return request({
        method: 'POST',
        uri: url,
        headers: {
            Referer: 'http://m.hupu.com/nba/game'
        }
    }, function (errors, response, body) {
        if (!errors && response.statusCode == 200) {
            var data;
            try {
                data = JSON.parse(body).data;
            } catch (e) {
                onError(new Error("api error"));
            }
            onSuc(data);
        } else {
            onError(new Error("api error"));
        }
    });
};