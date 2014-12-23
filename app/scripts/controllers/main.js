'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the enlightenApp
 */
angular.module('enlightenApp')
	.controller('MainCtrl',
		['$scope', 'SqliteDatabase', 'Evented', 'FilterFactory',
			function ($scope, SqliteDatabase, Evented, FilterFactory)
	{
		$scope.files       = [];
		$scope.loadingData = false;

		var db             = null;
		var currentFilter  = null;

		var loadContent = function(filter)
		{
			$scope.loadingData = true;

			var res = filter.executeQuery(db);

			if (res.length)
			{
				for (var i = 0; i < res[0].values.length; ++i)
				{
					$scope.files.push(
					{
						fileName: res[0].values[i][0]
					});
				}
			}

			currentFilter      = filter;
			$scope.loadingData = false;
		}

		var onFilterChanged = function(filter)
		{
			$scope.files = [];
			loadContent(filter);
		}

		var onSuccess = function(database)
		{
			$scope.hasError = false;
			db = database;

			var filter = FilterFactory.defaultFilter();
			onFilterChanged(filter);
		}

		var onError = function()
		{
			$scope.hasError = true;
		}

		$scope.onLoadMoreContent = function()
		{
			if ($scope.loadingData)
				return;

			if (!currentFilter)
				return;

			var filter = currentFilter;
			filter.increaseRange();

			loadContent(filter);
		}

		SqliteDatabase("cat.lrcat", { success: onSuccess, error: onError });
		Evented.register("FilterChanged", onFilterChanged);
	}])

	.controller('PathsCtrl',
		['$scope', 'SqliteDatabase', 'Evented', 'FilterFactory',
			function ($scope, SqliteDatabase, Evented, FilterFactory)
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
					id: rowVal[0],
					name: rowVal[1],
					itemCount: 0,
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
					id: id_local,
					name: rowVal[1],
					itemCount: 0
				});
			}
		}

		var onError = function()
		{
		}

		$scope.folderItemClicked = function(node)
		{
			var folderFilter = FilterFactory.getFilter("FolderFilter");
			folderFilter.folderIndex  = node.id;
			folderFilter.folderIsRoot = !!node.children;
			Evented.emit("FilterChanged", [folderFilter]);
		}

		SqliteDatabase("cat.lrcat", { success: onSuccess, error: onError });
	}]);
