'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the enlightenApp
 */
angular.module('enlightenApp')
	.controller('MainCtrl', ['$scope', function ($scope)
	{
		$scope.files = [];

		var databaseDownloaded = function()
		{
			var data = new Uint8Array(this.response);
			var db = new SQL.Database(data);

			var res = db.exec("SELECT originalFilename FROM AgLibraryFile LIMIT 100");

			for (var i = 0; i < res[0].values.length; ++i)
			{
				$scope.files.push(
				{
					fileName: res[0].values[i][0]
				});
			}

			$scope.$apply();
		}

		// Grab the database
		var req = new XMLHttpRequest();
		req.responseType = "arraybuffer";
		req.onload = databaseDownloaded;
		req.open("GET", "cat.lrcat", true);
		req.send();
	}]);
