var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/avy-rose');

var ForecastModel = require('./models/forecastModel');

var lvlLookup = {
    Btl: 'bt',
    Tln: 'tl',
    Alp: 'at'
}

var cleanHouse = function (mostRecent) {
    ForecastModel.find(function (err, forecasts) {
        if(err) console.log(err);

        forecasts.sort(compare);

        for(var i = (mostRecent - 1); i < forecasts.length; i++){
            ForecastModel.findByIdAndRemove(forecasts[i]._id, function (err, data) {
                if(err) console.log(err);
            });
        }
    })
}

var compare = function (a,b) {
  if (a.scrapeDate < b.scrapeDate)
     return 1;
  if (a.scrapeDate > b.scrapeDate)
    return -1;
  return 0;
}

var forecastBuilder = function (el) {
    var forecast = {};
    var idStr, dir, lvl = '';
    var val = false;

    $(el).find('.ProblemRose').children('div').each( function (j, el) {
        if($(this).attr('id')){
            idStr = $(this).attr('id')
            idStr = idStr.substring(0, idStr.length - 2);

            dir = idStr.substring(0, idStr.length - 3).toLowerCase();
            lvl = idStr.substring(idStr.length - 3);

            val = $(this).hasClass('on');

            if(!(dir in forecast)) forecast[dir] = {}
            forecast[dir][lvlLookup[lvl]] = val;
        
        }
    });
    return forecast;
}

var ratingBuilder = function (rating){
    return rating.toLowerCase().substring(0, rating.length - 4).trim()
}

/* deletes all entries from db except the 10 most recent */
cleanHouse(10);

request('http://avalanche.state.co.us/caic/pub_bc_avo.php?zone_id=1', function (error, response, body) {

    if(error) console.log(error);

    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);

        var forecast = [];

        var report = new ForecastModel();

        /* forecast date */
        var forecastDate = $('.caption-controls').first().html();
        forecastDate = forecastDate.substring(0, forecastDate.indexOf('<span'));
        report.forecastDate = forecastDate.replace(/(\t|\n)+/g, "").trim();

        /* zone 
         * hard coded because requires a different url 
        */
        var zone = 'front range'
        report.zone = zone;

        /* danger ratings */
        var at = $('.above-treeline-image').closest('tr').find('.today-text strong').text();
        report.atRating = ratingBuilder(at);
        var tl = $('.near-treeline-image').closest('tr').find('.today-text strong').text();
        report.tlRating = ratingBuilder(tl);
        var bt = $('.below-treeline-image').closest('tr').find('.today-text strong').text();
        report.btRating = ratingBuilder(bt);
        
        /* builds rose data */
        $('.table-persistent-slab').each(function (i, el) {
            if(i < 2){
                forecast[i] = forecastBuilder($(this))
                forecast[i].title = $(this).find('h4').text().replace(/(\s|\n)+/g, "");
            }
        });

        report.forecast = forecast;
    }

    report.save(function (err, doc) {
        if(err) console.log(err);
        mongoose.disconnect();  
    })
});

