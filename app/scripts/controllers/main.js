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
			$scope.hasError = false;
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
			$scope.hasError = true;
		}

		SqliteDatabase("cat.lrcat", { success: onSuccess, error: onError });
	}])

	.controller('PathsCtrl', ['$scope', 'SqliteDatabase', function ($scope, SqliteDatabase)
	{
		$scope.folderModel = [];
		$scope.folderTreeOptions = {
		}

		var onSuccess = function(db)
		{
			var rootFolders = db.exec("SELECT id_local,name FROM AgLibraryRootFolder");
			var libraryFolders = db.exec("SELECT id_local,pathFromRoot,rootFolder FROM AgLibraryFolder");

			// Track the folder indices
			var folderIndices = {}

			// Process root folders
			for (var rootIdx = 0; rootIdx < rootFolders[0].values.length; ++rootIdx)
			{
				var rowVal     = rootFolders[0].values[rootIdx];
				var arrayIndex = $scope.folderModel.push(
				{
					name: rowVal[1],
					children: []
				}) - 1;

				var id_local   = rowVal[0];
				folderIndices[id_local] = arrayIndex;
			}

			// Process subfolders
			for (var folderIdx = 0; folderIdx < libraryFolders[0].values.length; ++folderIdx)
			{
				var rowVal = libraryFolders[0].values[folderIdx];
				var rootIndex = rowVal[2];
				var id_local  = rowVal[0];

				if (rowVal[1] == "")
					continue;

				var rootArrayIndex = folderIndices[rootIndex];
				$scope.folderModel[rootArrayIndex].children.push(
				{
					name: rowVal[1]
				});
			}
		}

		var onError = function()
		{
		}

		SqliteDatabase("cat.lrcat", { success: onSuccess, error: onError });
	}]);
