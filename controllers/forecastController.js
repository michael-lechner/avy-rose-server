var ForecastModel = require('../models/forecastModel');
var mongoose = require('mongoose');

var forecastController = module.exports = {
    find: function (req, res) {
        ForecastModel.find().sort('-scrapeDate').exec(function (err, forecasts) {
            if(err) console.log(err);
            res.send(forecasts.slice(0, 1));            
        });
    },
    findAll: function (req, res) {
        ForecastModel.find().sort('-scrapeDate').exec(function (err, forecasts) {
            if(err) console.log(err);
            res.send(forecasts.slice(0));
        });
    }
}