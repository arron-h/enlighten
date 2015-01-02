"use strict";

describe("Factory: BackendFactory", function()
{
	// load the controller"s module
	beforeEach(module("enlightenApp"));

	var _BackendFactory;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(BackendFactory)
	{
		_BackendFactory = BackendFactory;
	}));

	it("should return an AWS backend", function()
	{
		var backend = _BackendFactory("AWS");
		expect(backend.type()).toEqual("AWS");
	});

	it("should return an HTTP backend", function()
	{
		var backend = _BackendFactory("HTTP");
		expect(backend.type()).toEqual("HTTP");
	});
});
