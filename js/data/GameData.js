/*
 * TODO: Very unfinished 
 */


/*
* Load
* Uses AJAX to load a given file that should contain
* game data.
* Note: Appends "data/", so filename should be relative to that path.
* TODO: error doesn't actually seem to work.
*/
GameData.prototype.Load = function(filename)
{
	var ajaxSettings = {
			async: false,
			url: ("data/" + filename), 
			context: this,
			success: function(result)
				{
					this[result.label] = result.data;
				}, 
			error: function(event, request, settings, error)
				{
					$("outputM").html("AJAXError:" + error);
				},
			dataType: "json" 
		};
		
	$.ajax(ajaxSettings);
}

GameData.prototype.GetSkillData(key)
{
	return this.skills[key];
}

GameData.prototype.GetTalentData(key)
{
	return this.talents[key];
}

// Default constructor for now.
function GameData()
{
	//this.Load("equipment.txt");
	this.Load("skills.txt");
}