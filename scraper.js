var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/avy-rose');

var ForecastModel = require('./models/forecastModel');




var requestStr = '';

var forecast1 = {};
// forecast[lookup[id]] = true;
// forecase[dir][line] = 


request('http://avalanche.state.co.us/caic/pub_bc_avo.php?zone_id=1', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    
    var forecast = new ForecastModel();

    $('.table-persistent-slab').each(function (i, el) {
        if(i < 2){

            console.log(forecast);

            console.log($(this).find('h4').text());
            $(this).find('.ProblemRose').children('div').each( function (i, el) {
                if($(this).attr('id')){
                    console.log($(this).attr('id') + ': ' + $(this).hasClass('on'));        
                }
            });
        }
    });
  }

            forecast.save(function (err, doc) {
                if(err) console.log(err);
                mongoose.disconnect();  
            })



})

