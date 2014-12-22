angular.module('databaseService')
	.factory('LrCatDatabase', function()
	{
		var databaseObject = null;

		return function()
		{
			if (!databaseObject)
			{
				var databaseDownloaded = function()
				{
					var data = new Uint8Array(this.response);
					var db = new SQL.Database(data);

					databaseObject = db;
				}

				// Grab the database
				var req = new XMLHttpRequest();
				req.responseType = "arraybuffer";
				req.onload = databaseDownloaded;
				req.open("GET", "cat.lrcat", true);
				req.send();
			}
		}

		this.

	});
