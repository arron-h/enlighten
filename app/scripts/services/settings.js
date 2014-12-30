'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.factory:Settings
 * @description
 * # Settings
 * A Settings singleton
 */
angular.module('enlightenApp')
	.factory('Settings', function()
	{
		var settings =
		{
			credentials:
			{
				AWS:
				{
					accessKey: "",
					secretKey: "",
					region: "",
					isValid: function()
					{
						return !!(this.accessKey && this.secretKey && this.region);
					},
					reset: function()
					{
						this.accessKey = "";
						this.secretKey = "";
						this.region = "";
					},
					copyFrom: function(other)
					{
						this.accessKey = other.accessKey;
						this.secretKey = other.secretKey;
						this.region    = other.region;
					}
				}
			},

			lightroom:
			{
				pathToLrCat: "",
				isValid: function()
				{
					return !!(this.pathToLrCat);
				},
				reset: function()
				{
					this.pathToLrCat = "";
				},
				copyFrom: function(other)
				{
					this.pathToLrCat = other.pathToLrCat;
				}
			},

			application:
			{
				backendType: "",
				isValid: function()
				{
					return !!(this.backendType);
				},
				reset: function()
				{
					this.backendType = "";
				},
				copyFrom: function(other)
				{
					this.backendType = other.backendType;
				}
			}
		}

		var loadAWSCredentials = function()
		{
			settings.credentials["AWS"].accessKey = localStorage.getItem("aws.accessKey");
			settings.credentials["AWS"].secretKey = localStorage.getItem("aws.secretKey");
			settings.credentials["AWS"].region    = localStorage.getItem("aws.region");
		}

		var loadLightroomSettings = function()
		{
			settings.lightroom.pathToLrCat = localStorage.getItem("lr.pathToLrCat");
		}

		var loadApplicationSettings = function()
		{
			settings.application.backendType = localStorage.getItem("app.backendType");
		}

		return {
			hasCredentials: function()
			{
				if (!settings.credentials["AWS"].isValid())
					loadAWSCredentials();

				return settings.credentials["AWS"].isValid();
			},

			getAWSCredentials: function()
			{
				if (!settings.credentials["AWS"].isValid())
					loadAWSCredentials();

				return settings.credentials["AWS"];
			},

			setAWSCredentials: function(awsCredentials)
			{
				localStorage.setItem("aws.accessKey", awsCredentials.accessKey);
				localStorage.setItem("aws.secretKey", awsCredentials.secretKey);
				localStorage.setItem("aws.region", awsCredentials.region);

				settings.credentials["AWS"].copyFrom(awsCredentials);
			},

			getLightroomSettings: function()
			{
				if (!settings.lightroom.isValid())
					loadLightroomSettings();

				return settings.lightroom;
			},

			setLightroomSettings: function(lightroomSettings)
			{
				localStorage.setItem("lr.pathToLrCat", lightroomSettings.pathToLrCat);
				settings.lightroom.copyFrom(lightroomSettings);
			},

			getApplicationSettings: function()
			{
				if (!settings.application.isValid())
					loadApplicationSettings();

				return settings.application;
			},

			setApplicationSettings: function(applicationSettings)
			{
				localStorage.setItem("app.backendType", applicationSettings.backendType);
				settings.application.copyFrom(applicationSettings);
			}
		}
	});
