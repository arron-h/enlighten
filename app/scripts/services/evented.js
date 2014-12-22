'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.factory:Evented
 * @description
 * # Evented
 * A simple event service
 */
angular.module('enlightenApp')
	.factory('Evented', function()
	{
		var listeners = {};

		return {
			register: function(eventType, callback)
			{
				if (!listeners[eventType])
					listeners[eventType] = [];

				listeners[eventType].push(callback);
			},

			emit: function(eventType, argArray)
			{
				if (listeners[eventType])
				{
					for (var i = 0; i < listeners[eventType].length; ++i)
					{
						listeners[eventType][i].apply(null, argArray);
					}
				}
			}
		}
	});
