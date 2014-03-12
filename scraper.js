var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

//mongoose.connect('mongodb://localhost/avy-rose');

var ForecastModel = require('./models/forecastModel');

var lvlLookup = {
    Btl: 'bt',
    Tln: 'tl',
    Alp: 'at'
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

request('http://avalanche.state.co.us/caic/pub_bc_avo.php?zone_id=1', function (error, response, body) {

    if(error) console.log(error);

    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);

        var forecast = [];

        var report = new ForecastModel();

        /* Forecast Date */
        var forecastDate = $('.caption-controls').first().html();
        forecastDate = forecastDate.substring(0, forecastDate.indexOf('<span'));
        report.forecastDate = forecastDate.replace(/(\t|\n)+/g, "").trim();

        /* builds rose data */
        $('.table-persistent-slab').each(function (i, el) {
            if(i < 2){
                forecast[i] = forecastBuilder($(this))
                forecast[i].title = $(this).find('h4').text().replace(/(\s|\n)+/g, "");
            }
        });

        report.forecast = forecast;
    }

    console.log(report  );

    // report.save(function (err, doc) {
    //     if(err) console.log(err);
    //     mongoose.disconnect();  
    // })
});

