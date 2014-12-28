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
		$scope.save = function(credentials, lr)
		{
			if (!credentials.accessKey || !credentials.secretKey ||
			   !credentials.region)
			{
				throw new Exception("Missing values from object!");
			}

			if (!lr.pathToLrCat)
				throw new Exception("Missing values from object!");

			Settings.setAWSCredentials(credentials);
			Settings.setLightroomSettings(lr);

			$scope.credentials = credentials;
			$scope.lr          = lr;
		}

		var credentials = Settings.getAWSCredentials();
		var lrSettings  = Settings.getLightroomSettings();

		$scope.credentials = credentials;
		$scope.lr = lrSettings;
	}]);
