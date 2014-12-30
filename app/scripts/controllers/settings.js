'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.controller:SettingsCtrl
 * @description
 * # SettingsCtrl
 */
angular.module('enlightenApp')
	.controller('SettingsCtrl',
		['$scope', 'Settings',
			function ($scope, Settings)
	{
		$scope.save = function(credentials, lr, app)
		{
			if (app.backendType === "AWS")
			{
				if (!credentials.accessKey || !credentials.secretKey ||
				   !credentials.region)
				{
					throw new ReferenceError("Missing values from object!");
				}
			}

			if (!lr.pathToLrCat)
				throw new ReferenceError("Missing values from object!");

			if (!app.backendType)
				throw new ReferenceError("Missing values from object!");

			Settings.setAWSCredentials(credentials);
			Settings.setLightroomSettings(lr);
			Settings.setApplicationSettings(app);

			$scope.credentials = credentials;
			$scope.lr          = lr;
			$scope.app         = app;
		}

		var credentials = Settings.getAWSCredentials();
		var lrSettings  = Settings.getLightroomSettings();
		var appSettings = Settings.getApplicationSettings();

		$scope.credentials = credentials;
		$scope.lr = lrSettings;
		$scope.app = appSettings;
	}]);
