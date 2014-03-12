var mongoose = require('mongoose');

var ForecastSchema = new mongoose.Schema({
    scrapeDate: { type: Date, default: Date.now },
    forcastDate: String,
    zone: String,
    btRating: String,
    tlRating: String,
    atRating: String,
    forecast1: {},
    forecast2: {}
});

var ForecastModel = module.exports = mongoose.model('forecast', ForecastSchema);