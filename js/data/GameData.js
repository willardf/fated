/*
 * TODO: Very unfinished 
 */


/*
* LoadAppend
* Uses AJAX to load a given file that should contain
* game data.
* Note: Appends "data/", so filename should be relative to that path.
* TODO: error doesn't actually seem to work.
*/
GameData.prototype.LoadAppend = function(filename, destContext)
{
	if (destContext == undefined)
	{
		destContext = this; 
	}
	var ajaxSettings = {
			async: false,
			url: ("data/" + filename), 
			context: destContext,
			success: function(result)
				{
					this[result.label] = result.data;
				}, 
			error: function(event, error)
				{
					$("p#errors").html(filename + ": AJAXError=" + error + "</br>");
				},
			dataType: "json" 
		};
		
	$.ajax(ajaxSettings);
}

GameData.prototype.GetEnemyData = function(key)
{
	if (!(key in this.enemies))
	{
		var filename = "enemies/" + key + ".txt";
		this.LoadAppend(filename, this.enemies);
		
		this.enemies[key] = $.extend(new Character(), this.enemies[key]);
		this.enemies[key].equipment = $.extend(new CharacterEquipment(), this.enemies[key].equipment);
	}
	var copy = $.extend(true, {}, this.enemies[key]);
	return copy;
}

GameData.prototype.GetSkillData = function(key)
{
	return this.skills[key];
}

GameData.prototype.GetTalentData = function(key)
{
	return this.talents[key];
}

GameData.prototype.GetEquipmentData = function(key)
{
	return this.equipment[key];
}

// Default constructor for now.
function GameData()
{
	this.enemies = new Object();
	
	this.LoadAppend("skills.txt");
	this.LoadAppend("equipment.txt");
	
}