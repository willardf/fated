BattleComponent.prototype.NextTurn = function()
{ 
	++this.turnCounter;
	
	// TODO: Handle effects
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
	if (InputManager.IsKeyUniqueDown(InputManager.c_SpaceBar))
	{
		// FIXME: This doSkill obviously won't work. 
		// Something about menus and what got selected needs to be all up ins.
		if (this.doSkill())
		{
			this.NextTurn();
		}
		else
		{
			// Error: Not enough PiPs, watwat?
		}
	}
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
	$("outputB").html(JSON.stringify(this.turnOrder));
}

// Validates skill, returns success
BattleComponent.prototype.DoSkill = function(skillname, target)
{
	var skilldata = g_GameManager.GameData.GetSkillData(skillname);
	var current = this.turnOrder[this.turnCounter];
	
	// TODO? We currently assume skills are only limited by pips. This may change.
	if (current.pip >= skilldata.pip)
	{
		current.pip -= skilldata.pip;
	}
	else
	{
		return false;
	}
	
	// TODO: Immediate Interrupts
	
	var damage = current.GetPower() + skilldata.power;
	if (skilldata.magical)
	{
		damage -= target.GetMDef();
	} 
	else
	{
		damage -= target.GetWDef();
	}
	damage *= (Math.random() * 0.5) + 0.75;
	
	target.currHealth -= damage;
	
	// TODO: Calculate specials and apply
	// TODO: Calculate effects and apply
	// TODO: Immediate reactions
	// TODO: Handle deaths
	// TODO: Add animations to queue
	
	this.MoveTurn(skilldata.speed);
	return true;
}

// NOTE: turnCounter IS NOT TO BE TRUSTED AFTER THIS FUNCTION.
// THIS FUNCTION SHOULD BE USED ONLY AT THE END OF A TURN.
BattleComponent.prototype.MoveTurn = function(amount)
{
	if (amount == 0) return;	// Not necessary, but wastes less time
	
	// Remove current turn-taker, save for later
	var temp = this.turnOrder.splice(this.turnCounter, 1)[0];
	
	var dest = this.turnCounter - amount;
	if (dest < 0)
	{
		dest += this.turnOrder.length; 
		// Let's assume we will never move more than one length of turnOrder (solid assumption)
		// We might need to think about mechanics if this becomes unsafe. (Effectively haste for a turn? sorta?)
	}
	
	// Annnd, reintroduce current turn-taker.
	this.turnOrder.splice(dest, 0, temp);
}

BattleComponent.prototype.RandomizeTurnOrder = function()
{
	// Randomize order
	for (var i = 0; i < this.turnOrder.length; ++i)
	{
		var random = Math.floor(Math.random() * this.turnOrder.length);
		var temp = this.turnOrder[i];
		this.turnOrder[i] = this.turnOrder[random];
		this.turnOrder[random] = temp;
	}
}

/* Constructor
 * Expects player's team instances to be on the right. 
 */
function BattleComponent(teamL, teamR)
{
	// make a copy of teamL, concat teamR to it.
	this.turnOrder = $.merge($.merge([], teamL), teamR);
	this.turnCounter = 0;
	
	this.RandomizeTurnOrder();
}