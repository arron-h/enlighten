"use strict";

/**
 * @ngdoc function
 * @name enlightenApp.service:BackendAWS
 * @description
 * # BackendAWS
 * An AWS backend implementation
 */
angular.module("enlightenApp")
	.service("BackendAWS",
		[
			"Settings",
			function(
				Settings
			)
	{
		this.requests     = {};
		this.requestCount = 0;
		this.s3Service    = new AWS.S3();

		this.get = function(url, callbacks)
		{
			var requestId = (this.requestCount++).toString();

			// Set the config
			var credentials = Settings.getAWSCredentials();
			AWS.config.update(
			{
				accessKeyId: credentials.accessKey,
				secretAccessKey: credentials.secretKey
			}, true);

			AWS.config.region = credentials.region;

			// Create the AWS.Request object
			var request = this.s3Service.getObject(
			{
				Bucket: "arronh.dev.test",
				Key: url
			});

			// Register a callback to report on the data
			var that = this;
			request.on("success", function(response)
			{
				var status = response.httpResponse.statusCode;
				var data   = response.data.Body;

				if (typeof callbacks.success === "function")
				{
					callbacks.success(data, status);
				}

				delete that.requests[requestId];
			});

			request.on("error", function(response)
			{
				var status = 0;
				var data   = null;
				if (response.httpResponse)
				{
					status = response.httpResponse.statusCode;
				}
				if (response.data)
				{
					data   = response.data.Body;
				}

				if (typeof callbacks.error === "function")
				{
					callbacks.error(data, status);
				}

				delete that.requests[requestId];
			});

			// Send the request
			request.send();

			this.requests[requestId] = request;
		};

		this.type = function()
		{
			return "AWS";
		};

		this.updateScope = function(scope)
		{
			scope.$apply();
		};
	}]);
