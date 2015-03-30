/**
 * ...
 * @author Danny Marcowitz
 */

var allCasinos = {
"casinos": [
	{
		"id": 1,
		"betMinimum": 50,
		"betMaximum": 500,
		"betInterval": 50,
	},
	{
		"id": 2,
		"betMinimum": 100,
		"betMaximum": 1000,
		"betInterval": 100,
	},
	{
		"id": 3,
		"betMinimum": 500,
		"betMaximum": 5000,
		"betInterval": 100,
	},
	{
		"id": 4,
		"betMinimum": 500,
		"betMaximum": 10000,
		"betInterval": 200,
	},
	{
		"id": 5,
		"betMinimum": 1000,
		"betMaximum": 50000,
		"betInterval": 500,
	}
	]
}


var allLevels =
 {"levels": [
	{
		// Level 1
		"id": "1",
		"repToUnlock": 0,
	},
	{
		// Level 2
		"id": "2",
		"repToUnlock": 2000,
	},
	{
		// Level 3
		"id": "3",
		"repToUnlock": 20000,
	},
	{
		// Level 4
		"id": "4",
		"repToUnlock": 150000,
	},
	{
		// Level 5
		"id": "5",
		"repToUnlock": 500000,
	}
	]
}

function GameplayDB() {
}

GameplayDB.prototype.getAllLevels = function() {
	return allLevels.levels;
}

GameplayDB.prototype.getAllCasinos = function() {
	return allCasinos.casinos;
}
