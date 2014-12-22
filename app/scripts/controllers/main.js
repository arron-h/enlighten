'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the enlightenApp
 */
angular.module('enlightenApp')
	.controller('MainCtrl', ['$scope', 'SqliteDatabase', function ($scope, SqliteDatabase)
	{
		$scope.files = [];

		var onSuccess = function(db)
		{
			var res = db.exec("SELECT originalFilename FROM AgLibraryFile LIMIT 100");

			for (var i = 0; i < res[0].values.length; ++i)
			{
				$scope.files.push(
				{
					fileName: res[0].values[i][0]
				});
			}
		}

		var onError = function()
		{
			console.warn("Error loading database file");
		}

		SqliteDatabase("cat.lrcat", { success: onSuccess, error: onError });
	}])

	.controller('PathsCtrl', function ($scope)
	{
		$scope.paths = ["a/", "b/", "c/"];
	});
