'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.service:BackendHTTP
 * @description
 * # BackendHTTP
 * A HTTP backend implementation
 */
angular.module('enlightenApp')
	.service('BackendHTTP',
		[
			"$http",
			function(
				$http
			)
	{
		this.get = function(url, callbacks)
		{
			$http.get(url, {responseType: "arraybuffer"})
				.success(function(response, status)
				{
					callbacks.success(response, status);
				})
				.error(function(response, status)
				{
					callbacks.error(response, status);
				});
		};

		this.type = function()
		{
			return "HTTP";
		};

		this.updateScope = function()
		{
		};
	}]);
