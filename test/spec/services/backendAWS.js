'use strict';

describe('Service: BackendAWS', function()
{
	// load the controller's module
	beforeEach(module('enlightenApp'));

	var _BackendAWS;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(BackendAWS)
	{
		_BackendAWS = BackendAWS;
	}));

	it('should return AWS when type() is called', function()
	{
		expect(_BackendAWS.type()).toEqual("AWS");
	});
});
