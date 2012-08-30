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
}

/* 
 * GetFlag
 * Returns the integer value corresponing to key
 * Sets key = 0 if undefined.
 */
GameState.prototype.AddFlag = function(flag, val)
{
	this.flags[flag]++;// = val;
}

/*
 * Default constructor
 */
function GameState()
{
	this.flags = new Object();
	
	this.money = 0;
	this.inventory = [];
}