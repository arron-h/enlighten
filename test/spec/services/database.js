'use strict';

describe('Factory: SqliteDatabase', function()
{
	// load the controller's module
	beforeEach(module('enlightenApp'));

	var _SqliteDatabase;
	var validDatabases;

	var FakeBackend = function()
	{
		return {
			get: function(url, callbacks)
			{
				if (url === "invalidmockdb.sql")
				{
					callbacks.error(null, 404);
				}
				else
				{
					var buffer = new ArrayBuffer(0);
					callbacks.success(buffer, 200);
				}
			},

			type: function()
			{
				return "Fake";
			}
		}
	}

	// Initialize the factory and a mock scope
	beforeEach(inject(function(SqliteDatabase)
	{
		_SqliteDatabase = SqliteDatabase;
	}));

	it('should load a valid database and invoke the given callback', function()
	{
		var spy = jasmine.createSpy();

		var backend = new FakeBackend();
		_SqliteDatabase("validmockdb.sql", backend, { success: spy });

		expect(spy).toHaveBeenCalled();
	});

	it('should only load one instance of a database for a given url', function()
	{
		var spy = jasmine.createSpy();

		var backend = new FakeBackend();
		spyOn(backend, "get").and.callThrough();

		_SqliteDatabase("validmockdb.sql", backend, { success: spy });

		// Make another request for the same db
		_SqliteDatabase("validmockdb.sql", backend, { success: spy });

		expect(spy.calls.count()).toEqual(2);
		expect(backend.get.calls.count()).toEqual(1);
	});

	it('should call multiple callbacks when loading a single database', function()
	{
		var spyA = jasmine.createSpy("SpyA");
		var spyB = jasmine.createSpy("SpyB");
		var spyC = jasmine.createSpy("SpyC");

		var backend = new FakeBackend();
		_SqliteDatabase("validmockdb.sql", backend, { success: spyA });
		_SqliteDatabase("validmockdb.sql", backend, { success: spyB });
		_SqliteDatabase("validmockdb.sql", backend, { success: spyC });

		expect(spyA).toHaveBeenCalled();
		expect(spyB).toHaveBeenCalled();
		expect(spyC).toHaveBeenCalled();
	});

	it('should load multiple databases for multiple urls', function()
	{
		var spyA = jasmine.createSpy();
		var spyB = jasmine.createSpy();

		var backend = new FakeBackend();
		spyOn(backend, "get").and.callThrough();

		_SqliteDatabase("validmockdb1.sql", backend, { success: spyA });
		_SqliteDatabase("validmockdb2.sql", backend, { success: spyB });

		expect(spyA).toHaveBeenCalled();
		expect(spyB).toHaveBeenCalled();
		expect(backend.get.calls.count()).toEqual(2);
	});

	it('should invoke the error callback when failing to load the given url', function()
	{
		var successSpy = jasmine.createSpy("SuccessSpy");
		var errorSpy = jasmine.createSpy("ErrorSpy");

		var backend = new FakeBackend();
		_SqliteDatabase("invalidmockdb.sql", backend, { success: successSpy, error: errorSpy });

		expect(successSpy.calls.count()).toEqual(0);
		expect(errorSpy.calls.count()).toEqual(1);
	});
});
