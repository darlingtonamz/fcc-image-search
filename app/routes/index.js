'use strict';

module.exports = function(app, db) {
    app.route('/')
        .get(function(req, res) {
            res.render('index', {APP_URL: process.env.APP_URL});
        });
};
