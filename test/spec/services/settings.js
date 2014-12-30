'use strict';

describe('Factory: Settings', function()
{
	// load the controller's module
	beforeEach(module('enlightenApp'));

	var _Settings;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(Settings)
	{
		_Settings = Settings;
	}));

	describe('hasCredentials()', function()
	{
		it('should return false if no credentials exist', function()
		{
			spyOn(localStorage, "getItem").and.callFake(function()
			{
				return null;
			});

			expect(_Settings.hasCredentials()).toBe(false);
		});

		it('should return true if credentials exist', function()
		{
			spyOn(localStorage, "getItem").and.callFake(function(key)
			{
				if (key === "aws.accessKey") return "1234";
				else if (key === "aws.secretKey") return "5678";
				else if (key === "aws.region") return "eu-west";

				return null;
			});

			expect(_Settings.hasCredentials()).toBe(true);
		});
	});

	it('should load AWS credentials from localStorage', function()
	{
		spyOn(localStorage, "getItem").and.callFake(function(key)
		{
			if (key === "aws.accessKey") return "1234";
			else if (key === "aws.secretKey") return "5678";
			else if (key === "aws.region") return "eu-west";

			return null;
		});

		var credentials = _Settings.getAWSCredentials();
		expect(credentials.accessKey).toEqual("1234");
		expect(credentials.secretKey).toEqual("5678");
		expect(credentials.region).toEqual("eu-west");
	});

	it('should save AWS credentials to localStorage', function()
	{
		var accessKey, secretKey, region;
		spyOn(localStorage, "setItem").and.callFake(function(key, value)
		{
			if (key === "aws.accessKey")      accessKey = value;
			else if (key === "aws.secretKey") secretKey = value;
			else if (key === "aws.region")    region = value;
		});

		_Settings.setAWSCredentials({
			accessKey: "AYUDEF7868332",
			secretKey: "eoire9g389gh9gh8v348hhv98h934",
			region: "us-east"
		});

		expect(accessKey).toEqual("AYUDEF7868332");
		expect(secretKey).toEqual("eoire9g389gh9gh8v348hhv98h934");
		expect(region).toEqual("us-east");
	});

	it('should keep local AWS object up to date with multiple saves', function()
	{
		_Settings.setAWSCredentials({
			accessKey: "AYUDEF7868332",
			secretKey: "eoire9g389gh9gh8v348hhv98h934",
			region: "us-east"
		});

		_Settings.setAWSCredentials({
			accessKey: "OIJJHYTUIO87687",
			secretKey: "09u845jg4i5g397fbcy838f2h243f",
			region: "us-west"
		});

		var credentials = _Settings.getAWSCredentials();
		expect(credentials.accessKey).toEqual("OIJJHYTUIO87687");
		expect(credentials.secretKey).toEqual("09u845jg4i5g397fbcy838f2h243f");
		expect(credentials.region).toEqual("us-west");
	});

	it('should load lightroom settings from localStorage', function()
	{
		spyOn(localStorage, "getItem").and.callFake(function(key)
		{
			if (key === "lr.pathToLrCat") return "/my/fake/path.lrcat";
			return null;
		});

		var settings = _Settings.getLightroomSettings();
		expect(settings.pathToLrCat).toEqual("/my/fake/path.lrcat");
	});

	it('should save lightroom settings to localStorage', function()
	{
		var pathToLrCat;
		spyOn(localStorage, "setItem").and.callFake(function(key, value)
		{
			if (key === "lr.pathToLrCat") pathToLrCat = value;
		});

		_Settings.setLightroomSettings({
			pathToLrCat: "/my/cool/path.lrcat"
		});

		expect(pathToLrCat).toEqual("/my/cool/path.lrcat");
	});

	it('should keep local lightroom settings object up to date with multiple saves', function()
	{
		_Settings.setLightroomSettings({
			pathToLrCat: "/path/a",
		});

		_Settings.setLightroomSettings({
			pathToLrCat: "/path/b",
		});

		var settings = _Settings.getLightroomSettings();
		expect(settings.pathToLrCat).toEqual("/path/b");
	});

	it('should load application settings from localStorage', function()
	{
		spyOn(localStorage, "getItem").and.callFake(function(key)
		{
			if (key === "app.backendType") return "HTTP";
			return null;
		});

		var settings = _Settings.getApplicationSettings();
		expect(settings.backendType).toEqual("HTTP");
	});

	it('should save application settings to localStorage', function()
	{
		var backendType;
		spyOn(localStorage, "setItem").and.callFake(function(key, value)
		{
			if (key === "app.backendType") backendType = value;
		});

		_Settings.setApplicationSettings({
			backendType: "AWS"
		});

		expect(backendType).toEqual("AWS");
	});

	it('should keep local application settings object up to date with multiple saves', function()
	{
		_Settings.setApplicationSettings({
			backendType: "HTTP",
		});

		_Settings.setApplicationSettings({
			backendType: "AWS",
		});

		var settings = _Settings.getApplicationSettings();
		expect(settings.backendType).toEqual("AWS");
	});
});
