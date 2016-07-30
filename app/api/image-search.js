'use strict'
module.exports = function(app, db) {
  var request = require('request');
  app.get('/api/imagesearch/:id', searchImage);
  app.get('/api/latest/imagesearch', getSearches);
  app.route('/*')
    .get(function(req, res) {
        res.render('index', {
            err: "Error: You need to add a proper url"
        });
    });
  //app.get('/new/:url*', handleNewURL);

  //#/api/imagesearch/rerer?offset=dfmjdf
  function searchImage(req, res){
    var key = process.env.KEY;
    var cx = process.env.CX;
    var query = req.params.id;
    var offset = req.query.offset;
    var num = Boolean(req.query.num) ? req.query.num : 10;
    var url = "https://www.googleapis.com/customsearch/v1?q="+query+"&offset="+offset+"&num="+num+"&searchType=image&cx=015352046996571260712:6impfbfmvba&key=AIzaSyBcYaEGWGajyqyMJsAkRpGRijU9Lh8NPPg";

    var toSave = {
      "query": query,
      "time": new Date()
    };

    request.get(
      { uri: url,
       json: true,
        headers: {
          'Content-Type' : 'application/x-www-form-urlencoded',
        }
      }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //console.log(body) // Show the HTML for the Google homepage.
          var items = body.items.map(function(obj){
            var rObj = {};
            rObj["title"] = obj.title;
            rObj["image-link"] = obj.link;
            rObj["context"] = obj.image.contextLink;
            rObj["thumbnail"] = obj.image.thumbnailLink;
            return rObj;
          })
          res.send(items);
          save(toSave, db);
        }else{
          res.send(body);
        }
    });
  }

  function save(obj, db) {
    // Save object into db.
    var searches = db.collection('searches');
    searches.save(obj, function(err, result) {
      if (err) throw err;
      console.log('Saved ' + result);
    });
  }

  function getSearches(req, res) {
    var searches = db.collection('searches');
    searches.find({}).toArray(function(err, result){
      if (err) throw error;
      console.log(result);
      res.send(result);
    });
    //var searches = db.searches.find();
  }

};
