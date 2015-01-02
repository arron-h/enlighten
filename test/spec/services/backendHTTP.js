"use strict";

describe("Service: BackendHTTP", function()
{
	// load the controller"s module
	beforeEach(module("enlightenApp"));

	var _BackendHTTP;
	var _HttpBackend;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(BackendHTTP, $httpBackend)
	{
		_BackendHTTP = BackendHTTP;
		_HttpBackend = $httpBackend;
	}));

	afterEach(function()
	{
		_HttpBackend.verifyNoOutstandingExpectation();
		_HttpBackend.verifyNoOutstandingRequest();
	});

	it("should return HTTP when type() is called", function()
	{
		expect(_BackendHTTP.type()).toEqual("HTTP");
	});

	it("should invoke the success callback on HTTP success", function()
	{
		var spy = jasmine.createSpy();
		var urlEndpoint = "http://someurl.com/api";

		_HttpBackend.expectGET(urlEndpoint).respond(200);
		_BackendHTTP.get(urlEndpoint, { success: spy });
		_HttpBackend.flush();

		expect(spy).toHaveBeenCalledWith(undefined, 200);
	});

	it("should invoke the error callback on HTTP error", function()
	{
		var spy = jasmine.createSpy();
		var urlEndpoint = "http://someurl.com/api";

		_HttpBackend.expectGET(urlEndpoint).respond(404);
		_BackendHTTP.get(urlEndpoint, { error: spy });
		_HttpBackend.flush();

		expect(spy).toHaveBeenCalledWith(undefined, 404);
	});
});
