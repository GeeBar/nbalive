#!/usr/bin/env node
var program = require('commander');
var util = require("../lib/util");
var fs = require("fs");
var path = require("path");

var defaultDate = util.formatToday(new Date());
var Rank = require('../lib/rank');
var App = require("../lib/app");

program
    .version(JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).version)
    .option('-d, --date [date]', 'choose date', checkDate)
    .option('-r, --rank', 'show rank list')
    .parse(process.argv);

if (program.rank) {
    Rank();
} else {
    App("hupu", program.date || defaultDate);
}


function checkDate(aDate) {
    if (/^\d{4}\d{1,2}\d{1,2}/.test(aDate)) {
        return util.formatToday(new Date(aDate.slice(0,4), aDate.slice(4,6) - 1, aDate.slice(6,8)));
    } else {
        return defaultDate;
    }

}