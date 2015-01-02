"use strict";

describe("Factory: FilterFactory", function()
{
	// load the controller"s module
	beforeEach(module("enlightenApp"));

	var _FilterFactory;

	// Initialize the factory and a mock scope
	beforeEach(inject(function(FilterFactory)
	{
		_FilterFactory = FilterFactory;
	}));

	it("should return the Limit100 filter as the default filter", function()
	{
		var filter = _FilterFactory.defaultFilter();
		expect(filter.filterName()).toEqual("Limit100");
	});

	it("should return a given filter from a provided name", function()
	{
		var filters =
		[
			"Limit100",
			"FolderFilter"
		];

		filters.map(function(currentValue)
		{
			var filter = _FilterFactory.getFilter(currentValue);
			expect(filter.filterName()).toEqual(currentValue);
		});
	});

	describe("Filter: FolderFilter", function()
	{
		var FolderFilter;
		var db =
		{
			exec: function() {},
			each: function(query, perRowFn, doneFn)
			{
				// Return some mocked folder indices
				var rowData =
				[
					{ "id_local": 22 },
					{ "id_local": 24 },
					{ "id_local": 26 },
					{ "id_local": 28 },
				];

				for (var i = 0; i < rowData.length; ++i)
				{
					perRowFn(rowData[i]);
				}

				doneFn();
			}
		};

		beforeEach(function()
		{
			FolderFilter = _FilterFactory.getFilter("FolderFilter");
			spyOn(db, "exec");
			spyOn(db, "each").and.callThrough();
		});

		it("should return the first 0-100 results which have the supplied folder index," +
			" if the folder index is set", function()
		{
			FolderFilter.folderIsRoot = false;
			FolderFilter.folderIndex  = 22;

			FolderFilter.executeQuery(db);

			expect(db.exec).toHaveBeenCalled();
			expect(db.exec.calls.argsFor(0)).toMatch(/SELECT .* FROM AgLibraryFile WHERE folder IN \(22\) LIMIT 100 OFFSET 0/);
		});

		it("should first gather all of the folder indices under the supplied root folder," +
			"then return the first 0-100 results which belong to those indices", function()
		{
			FolderFilter.folderIsRoot = true;
			FolderFilter.folderIndex  = 1;

			FolderFilter.executeQuery(db);

			expect(db.each.calls.count()).toEqual(1);
			expect(db.each.calls.argsFor(0)).toMatch(/SELECT id_local FROM AgLibraryFolder WHERE rootFolder=1/);

			expect(db.exec.calls.count()).toEqual(1);
			expect(db.exec.calls.argsFor(0)).toMatch(/SELECT .* FROM AgLibraryFile WHERE folder IN \(22,24,26,28\) LIMIT 100 OFFSET 0/);
		});

		it("should be able to increase the range by 100", function()
		{
			FolderFilter.increaseRange();
			FolderFilter.folderIsRoot = false;
			FolderFilter.folderIndex  = 22;
			FolderFilter.executeQuery(db);

			expect(db.exec).toHaveBeenCalled();
			expect(db.exec.calls.argsFor(0)).toMatch(/SELECT .* FROM AgLibraryFile WHERE folder IN \(22\) LIMIT 100 OFFSET 100/);
		});
	});

	describe("Filter: Limit100", function()
	{
		var Limit100Filter;
		var db = { exec: function() {} };

		beforeEach(function()
		{
			Limit100Filter = _FilterFactory.getFilter("Limit100");
			spyOn(db, "exec");
		});

		it("should return the first 0-100 results from AgLibraryFile", function()
		{
			Limit100Filter.executeQuery(db);

			expect(db.exec).toHaveBeenCalled();
			expect(db.exec.calls.argsFor(0)).toMatch(/SELECT .* FROM AgLibraryFile LIMIT 100 OFFSET 0/);
		});

		it("should be able to increase the range by 100", function()
		{
			Limit100Filter.increaseRange();

			Limit100Filter.executeQuery(db);

			expect(db.exec).toHaveBeenCalled();
			expect(db.exec.calls.argsFor(0)).toMatch(/SELECT .* FROM AgLibraryFile LIMIT 100 OFFSET 100/);
		});
	});
});
