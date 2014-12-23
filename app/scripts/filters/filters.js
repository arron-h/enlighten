'use strict';

/**
 * @ngdoc function
 * @name enlightenApp.factory:FilterFactory
 * @description
 * # FilterFactory
 * Filters which can be used
 */
angular.module('enlightenApp')
	.factory('FilterFactory', function()
	{
		var filters =
		{
			"Limit100": function()
			{
				var upperBound = 100;
				var offset     = 0;

				this.executeQuery = function(db)
				{
					return db.exec("SELECT originalFilename FROM AgLibraryFile " +
						"LIMIT " + upperBound + " OFFSET " + offset);
				}

				this.increaseRange = function()
				{
					offset += 100;
				}
			},

			"FolderFilter": function()
			{
				var upperBound = 100;
				var offset     = 0;

				this.executeQuery = function(db)
				{
					var query;
					var indices = -1;

					if (this.folderIsRoot)
					{
						query = "SELECT id_local FROM AgLibraryFolder WHERE " +
							"rootFolder=" + this.folderIndex.toString();

						indices = "";
						var folders = db.each(query,
						function(row)
						{
							indices += row.id_local + ",";
						},
						function()
						{
							if (indices.length > 0)
								indices = indices.slice(0, indices.length - 1);
						});
					}
					else
					{
						indices = this.folderIndex;
					}

					query = "SELECT originalFilename FROM AgLibraryFile " +
						"WHERE folder IN (" + indices + ") " +
						"LIMIT " + upperBound + " OFFSET " + offset;

					return db.exec(query);
				}

				this.increaseRange = function()
				{
					offset += 100;
				}

				this.folderIndex  = 0;
				this.folderIsRoot = false;
			}
		};

		return {
			defaultFilter: function()
			{
				return new filters["Limit100"];
			},

			getFilter: function(filterName)
			{
				return new filters[filterName];
			}
		}
	});
