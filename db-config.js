var mongoose = require('mongoose');

module.exports = {
    connect: function () {
        if ('production' == process.env.NODE_ENV) {
            mongoose.connect('mongodb://mlechner2:admin123@oceanic.mongohq.com:10028/app22995659');
        }else{
            mongoose.connect('mongodb://localhost/avy-rose');
        }
    }
}
