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
    
}

request('http://avalanche.state.co.us/caic/pub_bc_avo.php?zone_id=1', function (error, response, body) {

    if(error) console.log(error);

    if (!error && response.statusCode == 200) {
        $ = cheerio.load(body);

        var requestStr = '';
        var forecast = [];

        var report = new ForecastModel();
        var idStr, dir, lvl = '';
        var val = false;

        $('.table-persistent-slab').each(function (i, el) {
            if(i < 2){
                console.log($(this).find('h4').text());
                $(this).find('.ProblemRose').children('div').each( function (j, el) {
                    if($(this).attr('id')){
                        idStr = $(this).attr('id')
                        idStr = idStr.substring(0, idStr.length - 2);

                        dir = idStr.substring(0, idStr.length - 3).toLowerCase();
                        lvl = idStr.substring(idStr.length - 3);

                        console.log(lvlLookup[lvl]);
                        val = $(this).hasClass('on');

                        if(!(dir in forecast1)) forecast1[dir] = {}
                        forecast1[dir][lvlLookup[lvl]] = val;
                    
                    }
                });
            }
        });
    }

    console.log(forecast);

            // report.save(function (err, doc) {
            //     if(err) console.log(err);
            //     mongoose.disconnect();  
            // })
});

