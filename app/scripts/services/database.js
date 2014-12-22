'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.factory:SqliteDatabase
 * @description
 * # SqliteDatabase
 * Loads and returns a Sqlite database via XMLHttpRequest
 */
angular.module('enlightenApp')
	.factory('SqliteDatabase', function()
	{
		var databaseObjects = {};

		return function(url, callback)
		{
			if (!databaseObjects[url])
			{
				// Add this callback to a promise list
				databaseObjects[url] =
				{
					promises: [callback],
					database: null
				}

				// Load the database via XMLHttpRequest
				var databaseDownloaded = function()
				{
					var data = new Uint8Array(this.response);
					var db = new SQL.Database(data);

					databaseObjects[url].database = db;

					// Invoke promises
					while (databaseObjects[url].promises.length > 0)
					{
						var fn = databaseObjects[url].promises[0];
						fn(databaseObjects[url].database);

						databaseObjects[url].promises.pop();
					}
				}

				// Grab the database
				var req = new XMLHttpRequest();
				req.responseType = "arraybuffer";
				req.onload = databaseDownloaded;
				req.open("GET", url, true);
				req.send();
			}
			else
			{
				if (databaseObjects[url].database)
				{
					callback(databaseObjects[url].database);
				}
				else
				{
					databaseObjects[url].promises.push(callback);
				}
			}
		}
	});
