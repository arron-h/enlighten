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

		return function(url, callbacks)
		{
			if (typeof callbacks != "object")
				throw new TypeError("Callbacks must be an object");

			if (!databaseObjects[url])
			{
				// Add the callbacks to a promise list
				databaseObjects[url] =
				{
					promises: [callbacks],
					database: null
				}

				var invokeCallbacks = function(promiseList, callbackType)
				{
					// Invoke promises
					while (promiseList.length > 0)
					{
						var topIdx = promiseList.length - 1;
						var fn     = promiseList[topIdx][callbackType];
						fn(databaseObjects[url].database);

						promiseList.pop();
					}

					return promiseList;
				}

				$http.get(url, {responseType: "arraybuffer"})
					.success(function(response, status)
					{
						if (status == 200)
						{
							var data = new Uint8Array(response);
							var db = new SQL.Database(data);

							databaseObjects[url].database = db;

							databaseObjects[url].promises =
								invokeCallbacks(databaseObjects[url].promises, "success");
						}
						else
						{
							databaseObjects[url].promises =
								invokeCallbacks(databaseObjects[url].promises, "error");
						}
					})
					.error(function(response, status)
					{
						databaseObjects[url].promises =
							invokeCallbacks(databaseObjects[url].promises, "error");
					});
			}
			else
			{
				if (databaseObjects[url].database)
				{
					callbacks.success(databaseObjects[url].database);
				}
				else
				{
					databaseObjects[url].promises.push(callbacks);
				}
			}
		}
	}]);
