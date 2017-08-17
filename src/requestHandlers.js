/**
* Self Sever
*
* deals with site requests
* @class requestHandler
* @package    Self Engine opensource project
* @copyright  Copyright (c) 2012 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
* @version    $Id$
*/
var querystring = require("querystring");
var fs = require("fs");
var util = require('util');
var http = require('http');

/**
* loads up home HTML page
* @method start
*
*/
function start(fullpath, response) {

	var data  = '';

	fs.readFile('./index.html', function(err, data) {
		response.setHeader('Access-Control-Allow-Origin', '*');
		response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
		response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
		response.writeHead(200, {"Content-Type": "text/html"});
		response.end(data);
	});

}

/**
* check token and account live
* @method livetokenaccount
*
*/
function livetokenaccount(liveaccount, livetoken) {

	if( livetoken == 'c9d2l0di2sd09s9ss')
	{
			var result = "passedenter";
			return result;
	}
	else
	{
		var result = "nopass";
		return result;

	}

}

/**
* routes signout requests
* @method logout
*
*/
function logout (fullpath, response, request, couchin, couchlive) {

		// When dealing with CORS (Cross-Origin Resource Sharing)
		// requests, the client should pass-through its origin (the
		// requesting domain). We should either echo that or use *
		// if the origin was not passed.
		var origin = (request.headers.origin || "*");
		// Check to see if this is a security check by the browser to
		// test the availability of the API for the client. If the
		// method is OPTIONS, the browser is check to see to see what
		// HTTP methods (and properties) have been granted to the
		// client.
		if (request.method.toUpperCase() === "OPTIONS"){

			// Echo back the Origin (calling domain) so that the
			// client is granted access to make subsequent requests
			// to the API.
			response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": origin,
					"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				}
			);

			// End the response - we're not sending back any content.
			return( response.end() );
		}

		// remove the token log for logout id
		couchin.resthistory['aboynejames'] = '';

		correctpwd = {"logout":"success"};
		checkjson = JSON.stringify(correctpwd);
		response.setHeader("access-control-allow-origin", origin);
		response.writeHead(200, {"Content-Type": "application/json"});
		response.end(checkjson);

}  // closes sigincheck

/**
* controls the syncing of data from local pouchdb to online couchdb
* @method swimdatasave
*
*/
function datasave(fullpath, response, request, settings, liveMongon) {

	var checkpassin = '';
	var livedatabase = '';

	// check token and db are live if not tell user to re signing
	var secpassed = livetokenaccount(fullpath[1], fullpath[2]);

	if(secpassed == "passedenter")
	{
                // When dealing with CORS (Cross-Origin Resource Sharing)
                // requests, the client should pass-through its origin (the
                // requesting domain). We should either echo that or use *
                // if the origin was not passed.
                var origin = (request.headers.origin || "*");
                // Check to see if this is a security check by the browser to
                // test the availability of the API for the client. If the
                // method is OPTIONS, the browser is check to see to see what
                // HTTP methods (and properties) have been granted to the
                // client.
                if (request.method.toUpperCase() === "OPTIONS"){
                        // Echo back the Origin (calling domain) so that the
                        // client is granted access to make subsequent requests
                        // to the API.
                        response.writeHead(
                                "204",
                                "No Content",
                                {
                                        "access-control-allow-origin": origin,
                                        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "access-control-allow-headers": "content-type, accept",
                                        "access-control-max-age": 10, // Seconds.
                                        "content-length": 0
                                }
                        );
                        // End the response - we're not sending back any content.
                        return( response.end() );
                }

		if(request.method == 'POST'){
;
			var syncdatain = '';
			var cleandata = '';
			request.on('data', function(chunk) {

				syncdatain += chunk;

			});

			request.on('end', function() {
				cleandata =  JSON.parse(syncdatain);
				// next make a PUT MongoDB
				liveMongon.insertCollection(cleandata);

				syncresponse = {"save":"passed"};
				checksync = JSON.stringify(syncresponse);
				response.setHeader("access-control-allow-origin", origin);
				response.writeHead(200, {"Content-Type": "application/json"});
				response.end(checksync);


			});
		}
	}
	else
	{
console.log('not passed');
		// When dealing with CORS (Cross-Origin Resource Sharing)
                // requests, the client should pass-through its origin (the
                // requesting domain). We should either echo that or use *
                // if the origin was not passed.
                var origin = (request.headers.origin || "*");
                // Check to see if this is a security check by the browser to
                // test the availability of the API for the client. If the
                // method is OPTIONS, the browser is check to see to see what
                // HTTP methods (and properties) have been granted to the
                // client.
               if (request.method.toUpperCase() === "OPTIONS"){
                        // Echo back the Origin (calling domain) so that the
                        // client is granted access to make subsequent requests
                        // to the API.
                        response.writeHead(
                                "401",
                                "No Content",
                                {
                                        "access-control-allow-origin": origin,
                                        //"access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "access-control-allow-headers": "content-type, accept",
                                        "access-control-max-age": 10, // Seconds.
                                        "content-length": 0
                                }
                        );
                        // End the response - we're not sending back any content.
                        //return( response.end() );
										// put return message to login to account or tell token in now out of date
											syncresponse = {"access":"fail"};
											checksync = JSON.stringify(syncresponse);
											response.setHeader("access-control-allow-origin", origin);
											response.writeHead(204, {"Content-Type": "application/json"});
											response.end(checksync);

										}
				syncresponse = {"access":"fail"};
				checksync = JSON.stringify(syncresponse);
				response.setHeader("access-control-allow-origin", origin);
				response.writeHead(204, {"Content-Type": "application/json"});
				response.end(checksync);
		}
};

/**
*  check if email id or data notification should be sent
* @method heartdata
*
*/
function heartdata(fullpath, response, request, setttings, liveMongo) {

	var checkpassin = '';
	var livedatabase = '';

	// check token and db are live if not tell user to re signing
	var secpassed = livetokenaccount(fullpath[1], fullpath[2]);

	if(secpassed == "passedenter")
	{
		// set design doc for email status
                // When dealing with CORS (Cross-Origin Resource Sharing)
                // requests, the client should pass-through its origin (the
                // requesting domain). We should either echo that or use *
                // if the origin was not passed.
                var origin = (request.headers.origin || "*");
                // Check to see if this is a security check by the browser to
                // test the availability of the API for the client. If the
                // method is OPTIONS, the browser is check to see to see what
                // HTTP methods (and properties) have been granted to the
                // client.
                if (request.method.toUpperCase() === "OPTIONS"){
                        // Echo back the Origin (calling domain) so that the
                        // client is granted access to make subsequent requests
                        // to the API.
                        response.writeHead(
                                "204",
                                "No Content",
                                {
                                        "access-control-allow-origin": origin,
                                        "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
                                        "access-control-allow-headers": "content-type, accept",
                                        "access-control-max-age": 10, // Seconds.
                                        "content-length": 0
                                }
                        );

                        // End the response - we're not sending back any content.
                        return( response.end() );
                }
		if(request.method == 'GET'){
			var syncdatain = '';
			var cleandata = '';
			request.on('data', function(chunk) {
				syncdatain += chunk;

			});

			request.on('end', function() {
				cleandata = "heartrate";
				// next make a PUT call to couchdb API
				// first need to see what type of save  data, id settings etc. and route appropriately
				if(cleandata == "heartrate")
				{
					// query couchdb for email/data status
					liveMongo.retrieveCollection(cleandata, fullpath,  response, origin);

				}
			});
		}
	}
};

exports.start = start;
exports.logout = logout;
exports.datasave = datasave;
exports.heartdata = heartdata;
