BattleComponent.prototype.NextTurn = function()
{ 
	this.turnCounter = (this.turnCounter + 1) % this.turnOrder.length;
	
	// TODO: Handle effects
	
	var current = this.turnOrder[this.turnCounter];
	var prompt = "Choose a skill";
	var skillItems = new Array();
	for (skillidx in current.skills)
	{
		var skillname = current.skills[skillidx];
		// "PowerName" : { "pip" : -1, "power" : 5, "magical" : true, "speed" : 1}
		var skillData = g_GameManager.GameData.GetSkillData(skillname);
		var newItem = {
				"text" : skillname + " [" + skillData.pip + "]", 
				"label" : skillname
			}
		skillItems.push(newItem);
	}
	this.menu = new MenuComponent(prompt, skillItems);
}

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
// TODO: This...
BattleComponent.prototype.Update = function()
{
	if (this.menu != undefined)
	{
		this.menu.Update();
		if (this.menu.finished)
		{
			var TARGAT = this.turnOrder[this.turnCounter];
			if (this.DoSkill(this.menu.GetResultLabel(), TARGAT))
			{
				this.NextTurn();
			}
			else
			{
				// Error: Not enough PiPs, watwat?
				this.menu.finished = false;				
			}
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
	$("#outputT").html("Battle");
	if (this.menu != undefined)
	{
		this.menu.Render();
	}
		// FIXME: For testing, represents turn meter thing
	$("#outputB").html(JSON.stringify(this.turnOrder));
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
	// Range = .75 to 1.75
	damage *= Math.random() + 0.75;
	
	target.currenthealth -= Math.round(damage);
	
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

BattleComponent.prototype.GetResultLabel = function()
{
	// FIXME:
	return undefined;
}

/* Constructor
 * Expects player's team references to be on the right. 
 */
function BattleComponent(teamL, teamR)
{
	var enemies = new Array();
	for (enemy in teamL)
	{
		var data = g_GameManager.GameData.GetEnemyData(teamL[enemy]);
		enemies.push(data);
	}
	
	this.finished = false;
	// make a copy of teamL, concat teamR to it.
	this.turnOrder = $.merge($.merge([], enemies), teamR);
	this.turnCounter = -1;
	this.RandomizeTurnOrder();
	this.NextTurn();
}