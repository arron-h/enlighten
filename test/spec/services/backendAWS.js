"use strict";

describe("Service: BackendAWS", function()
{
	// Load the controller"s module
	beforeEach(module("enlightenApp"));

	// Mocked values
	var fakeGoodData = new ArrayBuffer(32);
	var fakeGoodKey  = "fake/good/key";
	var fakeBadKey   = "fake/bad/key";

	// Dependencies
	var _BackendAWS;
	var _Settings;

	// Mocks
	var FakeS3Service;

	// Stub AWS S3 service
	beforeEach(function()
	{
		var FakeS3Request = function(params)
		{
			var callbacks = {};
			this.on = function(action, callback)
			{
				callbacks[action] = callback;
			};

			this.send = function()
			{
				if (params.Key === fakeGoodKey)
				{
					callbacks.success.call(null,
					{
						httpResponse: { statusCode: 200 },
						data: { Body: fakeGoodData }
					});
				}
				else
				{
					callbacks.error.call(null,
					{
						httpResponse: { statusCode: 404 },
						data: null
					});
				}
			};
		};

		FakeS3Service =
		{
			getObject: function(params)
			{
				return new FakeS3Request(params);
			}
		};

		spyOn(FakeS3Service, "getObject").and.callThrough();
		spyOn(AWS, "S3").and.callFake(function()
		{
			return FakeS3Service;
		});
	});

	// Initialize the factory and a mock scope
	beforeEach(inject(function(BackendAWS, Settings)
	{
		_BackendAWS = BackendAWS;
		_Settings   = Settings;
	}));

	it("should return AWS when type() is called", function()
	{
		expect(_BackendAWS.type()).toEqual("AWS");
	});

	it("should update the Angular scope when updateScope() is called", function()
	{
		var scope =
		{
			$apply: function() {}
		};
		spyOn(scope, "$apply");

		_BackendAWS.updateScope(scope);

		expect(scope.$apply).toHaveBeenCalled();
	});

	describe("Function: get()", function()
	{
		it("correctly configures the AWS config", function()
		{
			spyOn(AWS.config, "update");

			_Settings.setAWSCredentials(
			{
				accessKey: "1234",
				secretKey: "5678",
				region: "eu-west"
			});

			_BackendAWS.get("some/key", {});

			expect(AWS.config.update).toHaveBeenCalledWith(
			{
				accessKeyId: "1234",
				secretAccessKey: "5678"
			}, true);
			expect(AWS.config.region).toEqual("eu-west");
		});

		it("makes a request for the given URL", function()
		{
			_BackendAWS.get("some/key", {});
			expect(FakeS3Service.getObject).toHaveBeenCalledWith(
			{
				Bucket: "arronh.dev.test",
				Key: "some/key"
			});
		});

		it("calls the \"success\" callback when the request is successful", function()
		{
			var spy = jasmine.createSpy();

			_BackendAWS.get(fakeGoodKey, { success: spy });

			expect(spy).toHaveBeenCalledWith(fakeGoodData, 200);
		});

		it("calls the \"error\" callback when the request is unsuccessful", function()
		{
			var spy = jasmine.createSpy();

			_BackendAWS.get(fakeBadKey, { error: spy });

			expect(spy).toHaveBeenCalledWith(null, 404);
		});
	});
});
