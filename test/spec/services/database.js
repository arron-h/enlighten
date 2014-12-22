'use strict';

describe('Factory: SqliteDatabase', function()
{
	// load the controller's module
	beforeEach(module('enlightenApp'));

	var _SqliteDatabase;
	var _httpBackend;

	var validDatabases;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(SqliteDatabase, $httpBackend)
	{
		_SqliteDatabase = SqliteDatabase;
		_httpBackend    = $httpBackend;
	}));

	afterEach(function()
	{
		_httpBackend.verifyNoOutstandingExpectation();
		_httpBackend.verifyNoOutstandingRequest();
	});

	it('should load a valid database and invoke the given callback', function()
	{
		var spy = jasmine.createSpy();

		_httpBackend.expectGET("validmockdb.sql").respond(200);
		_SqliteDatabase("validmockdb.sql", { success: spy });
		_httpBackend.flush();

		expect(spy).toHaveBeenCalled();
	});

	it('should only load one instance of a database for a given url', function()
	{
		var spy = jasmine.createSpy();

		_httpBackend.expectGET("validmockdb.sql").respond(200);
		_SqliteDatabase("validmockdb.sql", { success: spy });
		_httpBackend.flush();

		// Make another request for the same db
		_SqliteDatabase("validmockdb.sql", { success: spy });

		expect(spy.calls.count()).toEqual(2);
	});

	it('should call multiple callbacks when loading a single database', function()
	{
		var spyA = jasmine.createSpy("SpyA");
		var spyB = jasmine.createSpy("SpyB");
		var spyC = jasmine.createSpy("SpyC");

		_httpBackend.expectGET("validmockdb.sql").respond(200);
		_SqliteDatabase("validmockdb.sql", { success: spyA });
		_SqliteDatabase("validmockdb.sql", { success: spyB });
		_SqliteDatabase("validmockdb.sql", { success: spyC });
		_httpBackend.flush();

		expect(spyA).toHaveBeenCalled();
		expect(spyB).toHaveBeenCalled();
		expect(spyC).toHaveBeenCalled();
	});

	it('should load multiple databases for multiple urls', function()
	{
		var spyA = jasmine.createSpy();
		var spyB = jasmine.createSpy();

		_httpBackend.expectGET("validmockdb1.sql").respond(200);
		_httpBackend.expectGET("validmockdb2.sql").respond(200);
		_SqliteDatabase("validmockdb1.sql", { success: spyA });
		_SqliteDatabase("validmockdb2.sql", { success: spyB });
		_httpBackend.flush();

		expect(spyA).toHaveBeenCalled();
		expect(spyB).toHaveBeenCalled();
	});

	it('should invoke the error callback when failing to load the given url', function()
	{
		var successSpy = jasmine.createSpy("SuccessSpy");
		var errorSpy = jasmine.createSpy("ErrorSpy");

		_httpBackend.expectGET("invalidmockdb.sql").respond(404);
		_SqliteDatabase("invalidmockdb.sql", { success: successSpy, error: errorSpy });
		_httpBackend.flush();

		expect(successSpy.calls.count()).toEqual(0);
		expect(errorSpy.calls.count()).toEqual(1);
	});
});
