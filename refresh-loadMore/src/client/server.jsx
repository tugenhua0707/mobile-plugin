import express from 'express'
import http from 'http';
import path from 'path'
import React from 'react'
import consolidate from 'consolidate';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 7777

app.set('views', __dirname + './views');
app.engine('html', consolidate.mustache);
app.set('view engine', 'html');

app.get('/home', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../../dist/client/views/home.html'));
});
// json数据模拟
app.get('/json/update.json', (req, res, next) => {
  res.json(
    [
      {
        "title":"Apple 苹果 iPhone 6s Plus (A1699) 16G 玫瑰金色 移动联通电信4G 全网通手机",
        "pic":"http://d8.yihaodianimg.com/N05/M03/D4/1E/CgQI0lYEBwWAQIvJAAFyostaOYY12501_80x80.jpg",
        "link":"#1",
        "date":"2015-12-01"
      },
      {
        "title":"Letv 乐视1S 乐1S 移动联通双4G 双卡双待 16GB 金",
        "pic":"http://d9.yihaodianimg.com/N07/M00/6B/E6/CgQIz1ZNQWeALuYuAASH8T5MJzY38001_80x80.jpg",
        "link":"#2",
        "date":"2015-12-02"
      },
      {
        "title":"NOKIA/诺基亚 2610 nokia 2610 经典诺基亚直板手机 学生备用老人手机 诺基亚低端功能机",
        "pic":"http://d8.yihaodianimg.com/N08/M0A/6B/E1/ChEi1lZhlgSAEES9AAIPUw3996808600_80x80.jpg",
        "link":"#3",
        "date":"2015-12-03"
      },
      {
        "title":"华为 Mate8 NXT-TL00 3GB+32GB版 移动定制 月光银",
        "pic":"http://d6.yihaodianimg.com/N09/M00/78/AA/ChEi2VZpRZCAeyz-AAP2yE5HMTQ17001_80x80.jpg",
        "link":"#4",
        "date":"2015-12-04"
      },
      {
        "title":"锤子 坚果 32GB 红色 移动联通4G手机 双卡双待",
        "pic":"http://d6.yihaodianimg.com/N07/M01/98/48/CgQI0FY3GNuAeKARAARTi1sTc0E99401_80x80.jpg",
        "link":"#5",
        "date":"2015-12-05"
      },
      {
        "title":"华为荣耀7i ATH-AL00 3G内存增强版 移动联通电信4G 沙滩金 双卡双待",
        "pic":"http://d9.yihaodianimg.com/N05/M0A/B6/5A/CgQI0lX45JWANx7NAANWUytnWfY51201_80x80.jpg",
        "link":"#6",
        "date":"2015-12-06"
      },
      {
        "title":"小米 红米2A 增强版 白色 16G 移动4G手机 官网版 双卡双待",
        "pic":"http://d6.yihaodianimg.com/N08/M08/94/33/ChEi1FX_oHWAWJYUAAL4rKvikTE54401_80x80.jpg",
        "link":"#7",
        "date":"2015-12-07"
      },
      {
        "title":"Samsung 三星 Galaxy Note4 N9108V 移动4G手机 幻影白",
        "pic":"http://d8.yihaodianimg.com/N06/M06/8A/B9/CgQIzVQj87GAZ2-bAAMyoIZt8v863301_80x80.jpg",
        "link":"#8",
        "date":"2015-12-08"
      },
      {
        "title":"HTC Desire 826T 魔幻蓝 移动4G手机 双卡双待",
        "pic":"http://d8.yihaodianimg.com/N06/M04/DC/24/ChEbu1T4HVeASjwEAAGHikpYgyQ10901_80x80.jpg",
        "link":"#9",
        "date":"2015-12-09"
      },
      {
        "title":"华为 荣耀畅玩4X Che2-UL00 联通标配版4G手机 双卡双待双通 白色",
        "pic":"http://d8.yihaodianimg.com/N05/M05/BE/72/ChEbulTYbhyAY_DmAAGmsWjdGgY32601_80x80.jpg",
        "link":"#10",
        "date":"2015-12-10"
      }
    ]
  )
})
if (process.env.NODE_ENV === undefined || process.env.NODE_ENV !== 'production') {
  var webpack = require('webpack');
  var config = require('../../webpack.config');
  var compiler = webpack(config);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
  var reload = require('reload');
  reload(server, app);
  app.use('/static', express.static(path.join(__dirname, '../../dist/client/static')));
}

console.log(`Server is listening to port: ${port}`);
server.listen(port)