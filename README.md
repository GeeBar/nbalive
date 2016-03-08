# nbalive


NBA live in terminal.

![rect](https://github.com/mangix/nbalive/blob/master/img/list.png)
![rect](https://github.com/mangix/nbalive/blob/master/img/live.png)
![rect](https://github.com/mangix/nbalive/blob/master/img/statistic.png)

## Installation

先安装[Node.js](http://nodejs.org/download/) ,然后

	$ npm install -g nbalive
	
## Usage
```bash
   Usage: nbalive [options]

   Options:

        -h, --help         output usage information
        -V, --version      output the version number
        -d, --date [date]  choose date
        -r, --rank         show rank list
```
## Example
	$ nbalive  //当天赛程
	$ nbalive -d 2014-12-01 //指定某天赛程
	$ nbalive -r //查看排名
	$ nbalive --help //查看帮助
	
	
## Bugs&Fix
###赛程
* 原作者的服务端没有更新，数据缺失——更换获取赛程为http://m.hupu.com/nba/game的一个AJAX接口

* 日期获取赛程——计算方式更新为：如果是当天12:00之前，获取当天比赛数据；如果12:00之后，获取明天比赛数据。-d后跟日期参数的，返回当天的比赛数据。

###比赛数据
*原作者的服务端没有更新，数据缺失——比赛数据接口更新为解析 <del>http://m.hupu.com/nba/game(由于数据维度太少，放弃)</del> http://g.hupu.com/nba/daily的HTML源代码
