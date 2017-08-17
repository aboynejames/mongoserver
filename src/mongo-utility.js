/**
*  LKN =- protocol
*
*  LKN mongo rest utiltiy
* @class mongoUtil
*
* @package    LKN - mongo server
* @copyright  Copyright (c) 2017 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

var http = require('http');
var MongoClient = require('mongodb').MongoClient;

var mongoUtil = function() {

  this.Mongolive = MongoClient;
	this.murl = "mongodb://localhost:27017/lknwearable";
  //this.createnewDB();
  //this.createCollection();
  //this.insertCollection();
  //this.retrieveCollection();

};

/**
* create a new database
* @method createnewDB
*/
mongoUtil.prototype.createnewDB = function () {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
console.log("Database created!");
    db.close();
  })

};

/**
* create a new collection (table)
* @method createCollection
*/
mongoUtil.prototype.createCollection = function () {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
    db.createCollection("heartrate", function(err, res) {
      if (err) throw err;
      console.log("Table created!");
      db.close();
    });
  });

};

/**
*  insert data into a collection
* @method createCollection
*/
mongoUtil.prototype.insertCollection = function (dataIN) {

  this.Mongolive.connect(this.murl, function(err, db) {
    if (err) throw err;
    var myobj = dataIN;//{ device: "mio", hr: "73" };
    db.collection("heartrate").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
    });
  });

};

/**
*  retrieve data from a collection
* @method createCollection
*/
mongoUtil.prototype.retrieveCollection = function (cleandata, fullpath,  response, origin) {

  this.Mongolive.connect(this.murl, function(err, db) {
;
    if (err) throw err;
    var query = { device: "mio" };
    db.collection("heartrate").find(query).toArray(function(err, result) {
      if (err) throw err;

      db.close();
      // return data and success to REST caller
      response.setHeader("access-control-allow-origin", origin);
    	response.writeHead(200, {"Content-Type": "application/json"});
    	response.end(JSON.stringify(result));


    });
  });

};


module.exports = mongoUtil;
