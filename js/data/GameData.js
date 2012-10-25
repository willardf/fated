/*
 * TODO: Very unfinished 
 */


/*
* LoadAppend
* Uses AJAX to load a given file that should contain
* game data.
* Note: Prepends "data/", so filename should be relative to that path.
* TODO: error doesn't actually seem to work.
*/
GameData.prototype.LoadAppend = function(filename, destContext)
{
	if (destContext == undefined)
	{
		destContext = this; 
	}
	var data = g_FileManager.LoadFromFile("data/" + filename);
	destContext[data.label] = data.data;
};

GameData.prototype.GetEnemyData = function(key)
{
	if (!(key in this.enemies))
	{
		var filename = "enemies/" + key + ".txt";
		this.LoadAppend(filename, this.enemies);
		this.enemies[key] = new Character(this.enemies[key]);
	}
	var copy = $.extend(true, {}, this.enemies[key]);
	return copy;
};

GameData.prototype.GetAllyData = function(key)
{
	if (!(key in this.allies))
	{
		var filename = "allies/" + key + ".txt";
		this.LoadAppend(filename, this.allies);
		
		this.allies[key] = new Character(this.allies[key]);
	}
	var copy = $.extend(true, {}, this.allies[key]);
	return copy;
};

GameData.prototype.GetSkillData = function(key)
{
	return this.skills[key];
};

GameData.prototype.GetTalentData = function(key)
{
	return this.talents[key];
};

GameData.prototype.GetEquipmentData = function(key)
{
	return this.equipment[key];
};

// Default constructor for now.
function GameData()
{
	this.enemies = new Object();
	this.allies = new Object();
	this.talents = new Object();
	this.equipment = new Object();
	this.skills = new Object();
	
	this.LoadAppend("skills.txt");
	this.LoadAppend("equipment.txt");
	
}