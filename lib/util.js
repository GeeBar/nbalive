var moment = require('moment');
var _ = require("underscore");

/**
 * filter html tag in string
 * */
exports.escape = function (str) {
    return str ? str.replace(/<[/]?\w+>/g, "") : ""
};


/**
 * cell
 * */
exports.cell = function (content, width, align) {
    var len = countCharacters(content);
    if (len >= width) {
        return content;
    }

    function countCharacters(str) {
        var totalCount = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                totalCount++;
            }
            else {
                totalCount += 2;
            }
        }
        return totalCount;
    }

    function empty(size) {
        return size <= 1 ? " " : (new Array(size)).join(" ");
    }

    switch (align) {
        case "right" :
            return empty(width - len) + content;
        case "center":
            return empty(Math.floor((width - len) / 2)) + content + empty(Math.round((width - len) / 2));
        default :
            return content + empty(width - len);
    }
};

var fixZero = function (num) {
    return num < 10 ? "0" + num : num;
};
/**
 * date formatToday
 * */
exports.formatToday = function (date) {
    //console.log(moment(date).add(12, 'hour').format('YYYY-MM-DD'));
    return moment(date).add(12, 'hour').format('YYYY-MM-DD');
};

/**
 * prevDate
 * @param text
 */

exports.prevDate = function(dateStr){
    return moment(dateStr).subtract(1, 'day').format('YYYY-MM-DD');
};

exports.loading = function (text) {
    console.log("\033[35m" + text + "\033[0m");
};

exports.animateLoad = {
    timer: null,
    start: function () {
        this.stop();
        var chars = ["|", "/", "-","\\"];
        var count = 0;
        var out = process.stdout;
        this.timer = setInterval(function () {
            out.write("\b\033[K");
            out.write(chars[count]);
            count++;
            count = (count > 3)? (count-4):count;
        }, 80);
    },
    stop: function () {
        clearInterval(this.timer);
        process.stdout.write("\b\033[K");
    }
};

/**
 * adapter for hupu origin api data
 * @param data
 */
exports.adapter = function (data){
    var gameList = _.values(data)[0]["gameinfo"];
    return _.map(gameList, function(game, i){
        var g = {};
        g.gameId = parseInt(game.match_id);
        g.time = game.time.split(" ")[1];
        g.host = game.home.name;
        g.hostScore = parseInt(game.home.score);
        g.visiting = game.away.name;
        g.visitScore = parseInt(game.away.score);
        g.status = parseInt(game.status);
        g.score = g.hostScore + "-" + g.visitScore;
        g.id = i;
        return g;
    });
};

