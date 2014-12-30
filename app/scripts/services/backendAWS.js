'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.service:BackendAWS
 * @description
 * # BackendAWS
 * An AWS backend implementation
 */
angular.module('enlightenApp')
	.service('BackendAWS',
		[
			function(
			)
	{
		this.get = function(url, callbacks)
		{
		};

		this.type = function()
		{
			return "AWS";
		};
	}]);
