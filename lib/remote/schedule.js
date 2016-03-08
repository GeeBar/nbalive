/**
 * 获取某天的赛程
 * */

var api = require("./api");
var util = require('./../util');

module.exports = function (channel, date, cb) {
    var d = date || "";
    return api.hupu_api({
        url: "/gameslist",
        data: {
            channel: channel,
            date: util.prevDate(d)
        },
        onSuc: function (data) {
            cb(null, util.adapter(data));
        },
        onError: function (err) {
            cb(err);
        }
    });
};