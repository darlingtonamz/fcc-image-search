'use strict';

var express = require('express');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var routes = require('./app/routes/index.js');
var api = require('./app/api/image-search.js');
require('dotenv').config({
  silent: true
});
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

mongo.connect(process.env.MONGOLAB_URI, function(err, db) {
  if (err) throw err;
  db.createCollection('searches', function(err, collection) {
    if (err) throw err;
    console.log('successfully connect to mongodb and create collection ' + collection.collectionName);
    routes(app, db);
    api(app, db);
  });
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log('listening on port ' + port);
});
