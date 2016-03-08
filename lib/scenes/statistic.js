/**
 * Statistic Scene
 * */

var util = require("util");
var Scene = require("../scene");
var _ = require("underscore");
var Grid = require("term-grid");
var HOST = "http://g.hupu.com/nba";
var cheerio = require("cheerio");
var request = require("request");

var StatisticScene = module.exports = function (gameInfo) {
    Scene.call(this);
    this.gameInfo = gameInfo;

    this.formMatchTable = function($){
        var arr = [];
        $('.itinerary_table>tbody tr').each(function(i){
            var row = [];
            $(this).find('td').each(function(){
                row.push($(this).text().trim());
            });
            arr.push(row);
        });

        return arr;
    };

    this.formPlayerTable = function($, type) {
        var index = (type === "home")?0:1;

        var arr = [];
        $($('.table_list_live')[index]).find('tbody>tr').each(function(i){
            var row = [];
            $(this).find('td').each(function(){
                row.push($(this).text().trim());
            });
            arr.push(row);
        });
        return arr;
    };
};

util.inherits(StatisticScene, Scene);

_.extend(StatisticScene.prototype, {
    start: function () {
        process.stdin.setRawMode(false);
        var gameInfo = this.gameInfo;
        var self = this;
        var url = HOST + "/daily/boxscore_" + gameInfo.gameId + ".html";

        this.api = request(url, function (error, response, body) {
            if (!error && response && response.statusCode == 200) {
                var $ = cheerio.load(body);
                var threeTables = [
                    [],
                    [],
                    []
                ];

                threeTables[0] = self.formMatchTable($);
                threeTables[1] = self.formPlayerTable($, 'home');
                threeTables[2] = self.formPlayerTable($, 'away');

                //self.createGrid(threeTables);
                self.draw(threeTables);
                //self.createGridBaseInfo();
                //self.configGridColor();
                //self.configGridAlign();

                //self.grid.draw();
                self.emit("finish");
            } else {
                console.log("data error");
            }
        });
    },
    stop: function () {
        this.api && this.api.abort();
    },
    createGrid: function (data) {
        this.grid = [];
        data.forEach(function(table){
            this.grid.push(new Grid(table));
        });
    },
    createGridBaseInfo: function () {
        var grid = this.grid;
        var data = grid.data;

        //column count
        var count = this.gridColumnCount = grid.getColumnCount();

        //find max data in each column
        var visitingStartRow = 0;
        var homeMax = this.homeMax = [];
        var visitMax = this.visitMax = [];
        data.forEach(function (row, i) {
            if (row[0] && ~row[0].toString().indexOf("客队")) {
                visitingStartRow = i;
            }
        });
        for (var i = 0; i < count; i++) {
            data.forEach(function (row, j) {
                var arr;
                var maxRow;
                if (i < row.length && /^[\+|-]?\d+$/.test(row[i])) {
                    if (j < visitingStartRow) {
                        arr = homeMax;
                        maxRow = visitingStartRow - 2;
                    } else {
                        arr = visitMax;
                        maxRow = data.length - 2;
                    }
                    if (j < maxRow && (arr[i] === undefined || parseInt(row[i]) > parseInt(arr[i]))) {
                        arr[i] = row[i];
                    }
                }
            });
        }
        this.visitingStartRow = visitingStartRow;
    },
    configGridColor: function () {
        var grid = this.grid;

        var visitingStartRow = this.visitingStartRow;
        var homeMax = this.homeMax;
        var visitMax = this.visitMax;

        //config color
        grid.setColor(function (content, row, column) {
            if (column == 0) {
                if (/主队|客队/.test(content)) {
                    return "magenta";
                } else if (/首发|替补/.test(content)) {
                    return "yellow";
                }
            } else {
                if (/首发|时间|投篮|3分|罚球|前场|后场|篮板|助攻|犯规|抢断|失误|封盖|得分|(\+\/-)/.test(content)) {
                    return "yellow";
                } else {
                    var targetMax;
                    if (row < visitingStartRow) {
                        targetMax = homeMax;
                    } else {
                        targetMax = visitMax;
                    }
                    if (content === targetMax[column]) {
                        return "green";
                    }
                }
            }
        });
    },
    configGridAlign: function () {
        //config align
        for (var i = 2; i < this.gridColumnCount; i++) {
            this.grid.setAlign(i, "right");
        }
    },

    draw: function (data) {
        data.forEach(function (table) {
            var grid = new Grid(table);
            grid.setColor(function (content, i, j) {
                if ( i >0 && i <= 5) {
                    return "yellow";
                }
                if (i == 0) {
                    return "magenta";
                }
            });

            var count = grid.getColumnCount();
            for (var i = 2; i < count; i++) {
                grid.setAlign(i,"center");
            }
            grid.draw();
        });
    }
});
