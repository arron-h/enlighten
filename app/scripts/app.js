"use strict";

/**
 * @ngdoc overview
 * @name enlightenApp
 * @description
 * # enlightenApp
 *
 * Main module of the application.
 */
angular
	.module("enlightenApp",
	[
		"ngAnimate",
		"ngCookies",
		"ngResource",
		"ngRoute",
		"ngSanitize",
		"ngTouch",
		"angular.filter",
		"treeControl",
		"infinite-scroll"
	])
	.config(
	[
		"$routeProvider",
		function(
			$routeProvider
		)
	{
		$routeProvider
		.when("/",
		{
			templateUrl: "views/main.html"
		})
		.when("/settings",
		{
			templateUrl: "views/settings.html"
		})
		.otherwise(
		{
			redirectTo: "/"
		});
	}]);
