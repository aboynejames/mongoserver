/**
* Self Server
*
* Start node.js  Server
*
* @package    Train Timer part of open sport project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var http = require("http");
var url = require("url");
var sio = require('socket.io');
var fs = require('fs');
var util = require('util');
//var EventEmitter = require('events').EventEmitter;
var settings = require("./settings.js");
var MongoUtil = require("./mongo-utility.js");
var async = require('async');

/**
* controls start of node.js server
* @method start
*
*/
function start(route, handle) {

	var settingsin = {};
	var couchlive = {};
	var emaillive = {};

	settingsin = new settings();
	liveMongo = new MongoUtil();

	var app = http.createServer(onRequest).listen(8881);

	function onRequest(request, response) {

		var pathname = url.parse(request.url).pathname;

		route(handle, pathname, response, request, settingsin, liveMongo);
	}

	// data for live two way socket data flow for real time display everywhere
	var io = sio.listen(app);

	io.sockets.on('connection', function (socket, server) {

		socket.on('swimmerclientstart', function(stdata){
			socket.emit('startnews', 'localpi');

		});

		socket.on('checkSplitID', function(stdata){
			//idsetup.checkSplitIDs();

		});

		socket.on('contextMixer', function(datacontext){

			socket.broadcast.emit('contextEventdisplay', datacontext);
		});


	});


}; // closes start function


exports.start = start;
