BattleComponent.prototype.NextTurn = function()
{
	
}

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
// TODO: This...
BattleComponent.prototype.Update = function()
{
	// TODO: Select skill menu
	// if doSkill == true
	// Next turn
	// else, blahblahblah
}

/*
* Render
* Implements Component.Render
* Displays text.
*/
// TODO: This...
BattleComponent.prototype.Render = function()
{
	
	// FIXME: For testing, represents turn meter thing
	$("outputB").html(JSON.stringify(this.turnorder));
}

// Validates skill, returns success
BattleComponent.prototype.DoSkill = function(skillname)
{
	var skilldata = g_GameManager.GameData.LookUpSkill(skillname);
	var current = this.turnorder[this.turncounter];
	
	// TODO? We currently assume skills are only limited by pips. This may change.
	if (current.pip >= skilldata.pip)
	{
		current.pip -= skilldata.pip;
	}
	else
	{
		return false;
	}
	
	// TODO: Find target
	// TODO: Calculate "damage", and apply (negative damage = healing)
	// TODO: Calculate effects and apply
	
	this.MoveTurn(skilldata.speed);
	return true;
}

// NOTE: TURNCOUNTER IS NOT TO BE TRUSTED AFTER THIS FUNCTION.
// THIS FUNCTION SHOULD BE USED ONLY AT THE END OF A TURN.
BattleComponent.prototype.MoveTurn = function(amount)
{
	if (amount == 0) return;	// Not necessary, but wastes less time
	
	// Remove current turn-taker, save for later
	var temp = this.turnorder.splice(this.turncounter, 1)[0];
	
	var dest = this.turncounter - amount;
	if (dest < 0)
	{
		dest += this.turnorder.length; 
		// Let's assume we will never move more than one length of turnorder (solid assumption)
		// We might need to think about mechanics if this becomes unsafe. (Effectively haste for a turn? sorta?)
	}
	
	// Annnd, reintroduce current turn-taker.
	this.turnorder.splice(dest, 0, temp);
}

/* Constructor
 * Expects player's team instances to be on the right. 
 */
function BattleComponent(teamL, teamR)
{
	// make a copy of teamL, concat teamR to it.
	this.turnorder = $.merge($.merge([], teamL), teamR);
	this.turncounter = 0;
	
	// Randomize order
	for (var i = 0; i < this.turnorder.length; ++i)
	{
		var random = Math.floor(Math.random() * this.turnorder.length);
		var temp = this.turnorder[i];
		this.turnorder[i] = this.turnorder[random];
		this.turnorder[random] = temp;
	}
}