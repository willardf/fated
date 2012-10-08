/*
 * TODO: Very unfinished
 */

/* 
 * GetFlag
 * Returns the integer value corresponing to key
 * Sets key = 0 if undefined.
 */
GameState.prototype.GetFlag = function(key)

{
	if (this.flags[key] == undefined)
	{
		this.flags[key] = 0;
	}
	return this.flags[key];
};

/* 
 * GetFlag
 * Returns the integer value corresponing to key
 * Sets key = 0 if undefined.
 */
GameState.prototype.AddFlag = function(flag, val)
{
    if (val == undefined)
    {
        val = 0;
   } 
	this.flags[flag] = val;
};

GameState.prototype.AddSkill = function(skillname)
{
	if (this.skillsAvailable.indexOf(skillname) == -1)
	{
		this.skillsAvailable.push(skillname);
	}
};

GameState.prototype.AddAlly = function(allyName)
{
	var allyData = g_GameData.GetAllyData(allyName);
	this.playerTeam.push(allyData);
};

GameState.prototype.AddItem = function (itemName)
{
    this.inventory.push(itemName);
};

/*
 * Default constructor
 */
function GameState()
{
	this.flags = new Object();
	
	this.playerCharacter = new Character();
	this.playerTeam = new Array();
	this.playerTeam.push(this.playerCharacter);
	
	this.skillsAvailable = new Array();
	this.money = 0;
	this.inventory = new Array();
}