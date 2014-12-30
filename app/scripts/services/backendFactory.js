'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.factory:BackendFactory
 * @description
 * # BackendFactory
 * The backend provider for data.  There are several backend choices including
 * HTTP and Amazon S3 ('AWS').
 */
angular.module('enlightenApp')
	.factory('BackendFactory',
		[
			'BackendHTTP',
			'BackendAWS',
			function(
				BackendHTTP,
				BackendAWS
			)
	{
		return function(backendType) {
			if (backendType === "AWS")
			{
				return BackendAWS;
			}
			else if (backendType === "HTTP")
			{
				return BackendHTTP;
			}
			else
			{
				throw new Exception("Invalid backend type");
			}
		}
	}]);
