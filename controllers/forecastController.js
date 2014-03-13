var ForecastModel = require('../models/forecastModel');
var mongoose = require('mongoose');

var compare = function (a,b) {
  if (a.scrapeDate < b.scrapeDate)
     return 1;
  if (a.scrapeDate > b.scrapeDate)
    return -1;
  return 0;
}

var forecastController = module.exports = {
    find: function (req, res) {
        ForecastModel.find(function (err, forecasts) {
            if(err) console.log(err);

            forecasts.sort(compare);
            res.send(forecasts.slice(0, 1));
        });
    },
    findAll: function (req, res) {
        ForecastModel.find(function (err, forecasts) {
            if(err) console.log(err);

            forecasts.sort(compare);
            res.send(forecasts.slice(0));
        });        
    }
}