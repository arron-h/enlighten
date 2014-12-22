'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.factory:SqliteDatabase
 * @description
 * # SqliteDatabase
 * Loads and returns a Sqlite database via XMLHttpRequest
 */
angular.module('enlightenApp')
	.factory('SqliteDatabase', ["$http", function($http)
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

				$http.get(url, {responseType: "arraybuffer"})
					.success(function(response, status)
					{
						if (status == 200)
						{
							var data = new Uint8Array(response);
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
						else
						{
							console.warn("Status code != 200. Bailing.");
						}
					})
					.error(function(response, status)
					{
						console.warn("Error loading database object.");
					});
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
	}]);
