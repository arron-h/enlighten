"use strict";

/**
 * @ngdoc function
 * @name enlightenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the enlightenApp
 */
angular.module("enlightenApp")
	.controller("MainCtrl",
		[
			"$scope",
			"$location",
			"SqliteDatabase",
			"Evented",
			"FilterFactory",
			"Settings",
			"BackendFactory",
			function (
				$scope,
				$location,
				sqliteDatabase,
				evented,
				filterFactory,
				settings,
				backendFactory
				)
	{
		$scope.files       = [];
		$scope.loadingData = false;

		var db             = null;
		var currentFilter  = null;

		var backendType = settings.getApplicationSettings().backendType;
		var backend     = null;
		if (backendType)
		{
			backend = backendFactory(backendType);
		}
		else
		{
			$location.url("/settings");
		}

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
		};

		var onFilterChanged = function(filter)
		{
			$scope.files = [];
			loadContent(filter);
		};

		var onSuccess = function(database)
		{
			$scope.hasError = false;
			db = database;

			var filter = filterFactory.defaultFilter();
			onFilterChanged(filter);

			backend.updateScope($scope);
		};

		var onError = function()
		{
			$scope.hasError = true;
			backend.updateScope($scope);
		};

		$scope.onLoadMoreContent = function()
		{
			if ($scope.loadingData)
			{
				return;
			}

			if (!currentFilter)
			{
				return;
			}

			var filter = currentFilter;
			filter.increaseRange();

			loadContent(filter);
		};

		sqliteDatabase(settings.getLightroomSettings().pathToLrCat,
			backend, { success: onSuccess, error: onError });

		evented.register("FilterChanged", onFilterChanged);
	}])

	.controller("PathsCtrl",
		[
			"$scope",
			"SqliteDatabase",
			"Evented",
			"FilterFactory",
			"Settings",
			"BackendFactory",
			function(
				$scope,
				sqliteDatabase,
				evented,
				filterFactory,
				settings,
				backendFactory
			)
	{
		$scope.folderModel = [];
		$scope.folderTreeOptions = {};

		var onSuccess = function(db)
		{
			var rootFolders = db.exec("SELECT id_local,name FROM AgLibraryRootFolder");
			var libraryFolders = db.exec("SELECT id_local,pathFromRoot,rootFolder FROM AgLibraryFolder");

			// Track the folder indices
			var folderIndices = {};

			// Process root folders
			for (var rootIdx = 0; rootIdx < rootFolders[0].values.length; ++rootIdx)
			{
				var rootFoldersRowValue = rootFolders[0].values[rootIdx];
				var arrayIndex = $scope.folderModel.push(
				{
					id:   rootFoldersRowValue[0],
					name: rootFoldersRowValue[1],
					itemCount: 0,
					children: []
				}) - 1;

				var rootFolderIdLocal  = rootFoldersRowValue[0];
				folderIndices[rootFolderIdLocal] = arrayIndex;
			}

			// Process subfolders
			for (var folderIdx = 0; folderIdx < libraryFolders[0].values.length; ++folderIdx)
			{
				var folderRowValue = libraryFolders[0].values[folderIdx];
				var rootIndex      = folderRowValue[2];
				var folderIdLocal  = folderRowValue[0];

				if (folderRowValue[1] === "")
				{
					continue;
				}

				var rootArrayIndex = folderIndices[rootIndex];
				$scope.folderModel[rootArrayIndex].children.push(
				{
					id: folderIdLocal,
					name: folderRowValue[1],
					itemCount: 0
				});
			}

			backend.updateScope($scope);
		};

		var onError = function()
		{
		};

		$scope.folderItemClicked = function(node)
		{
			var folderFilter = filterFactory.getFilter("FolderFilter");
			folderFilter.folderIndex  = node.id;
			folderFilter.folderIsRoot = !!node.children;
			evented.emit("FilterChanged", [folderFilter]);
		};

		var backendType = settings.getApplicationSettings().backendType;

		if (backendType)
		{
			var backend     = backendFactory(backendType);

			sqliteDatabase(settings.getLightroomSettings().pathToLrCat,
				backend, { success: onSuccess, error: onError });
		}
	}]);
