var mongoose = require('mongoose');

var ForecastSchema = new mongoose.Schema({
    scrapeDate: { type: Date, default: Date.now },
    forecastDate: String,
    zone: String,
    btRating: String,
    tlRating: String,
    atRating: String,
    forecast: Array,
});

var ForecastModel = module.exports = mongoose.model('forecast', ForecastSchema);