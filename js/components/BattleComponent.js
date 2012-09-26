BattleComponent.prototype.NextTurn = function()
{ 
	// TODO: Check battle triggers
	for (t in this.triggers)
	{
		var trigger = this.triggers[t];
		
	}
	
	this.turnCounter = (this.turnCounter + 1) % this.turnOrder.length;
	var current = this.turnOrder[this.turnCounter];
	
	this.EvalEffects(current, true);
	
	
	var prompt = "Choose a skill";
	var skillItems = new Array();
	for (skillidx in current.skills)
	{
		var skillname = current.skills[skillidx];
		// "PowerName" : { "pip" : -1, "power" : 5, "magical" : true, "speed" : 1}
		var skillData = g_GameManager.GameData.GetSkillData(skillname);
		var newItem = {
				"text" : skillname + " [" + skillData.pip + "]", 
				"label" : skillname,
				toString : function(){return this.text;}
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
BattleComponent.prototype.Update = function()
{
	if (this.menu != undefined)
	{
		this.menu.Update();
		if (this.menu.finished)
		{
			var TARGAT = this.turnOrder[this.turnCounter];
			if (this.DoSkill(this.menu.GetResult().label, TARGAT))
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
	if (current.pip >= -skilldata.pip)
	{
		current.pip += skilldata.pip;
	}
	else
	{
		return false;
	}
	
	// TODO: Immediate Interrupts
	
	var damage = 0;
	if (skilldata.power != 0)
	{
		damage = current.GetPower() + skilldata.power;
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

		// TODO: Handle other damage mods (resist, weakness, absorb
			
		if (skilldata.power > 0 && damage > 0
			|| skilldata.power < 0 && damage < 0)
		{
			target.currenthealth -= Math.round(damage);
		}
	}
	
	// TODO: Calculate specials and apply
	
	this.ApplyEffects(skilldata.effects, current, target);
	
	// TODO: Immediate reactions
	// TODO: Handle deaths
	// TODO: Add animations to queue
	
	this.MoveTurn(skilldata.speed);
	return true;
}

BattleComponent.prototype.EvalEffects = function(recipient, save)
{
	var effectsList = recipient.effects;
	var eIdx;
	for (eIdx = 0; eIdx < effectsList.length; eIdx++)
	{
		var effect = effectsList[eIdx];
		
		if ("damage" in effect)
		{
			recipient.currentHealth -= effect.damage;
		}
		if ("power" in effect)
		{
			var damage = sender.GetPower() + effect.power;
			damage -= skilldata.magical ? target.GetMDef() : target.GetWDef();
			recipient.currentHealth -= damage;
		}
		if ("piptrade" in effect && recipient.pip > 0)
		{
			--recipient.pip;
			++sender.pip;
		}
		
		if (save)
		{
			var remove 
			if (effect.ongoing >= 1)
			{
				--effect.ongoing;
				remove = effect.ongoing <= 0;
			}
			else if (effect.ongoing < 1)
			{
				remove = (Math.random() < effect.ongoing);
			}
			
			if (remove)
			{
				effectsList.splice(eIdx, 1);
				eIdx--;
			}
		}
	}
}

BattleComponent.prototype.ApplyEffects = function(effectsList, current, target)
{
	for (eIdx in effectsList)
	{
		var effect = $.extend({}, effectsList[eIdx]);
		
		var sender = ("self" in effect) ? target : current;
		var recipient = ("self" in effect) ? current : target;
		
		if ("ongoing" in effect)
		{
			if ("power" in effect)
			{
				var damage = sender.GetPower() + effect.power;
				damage -= skilldata.magical ? target.GetMDef() : target.GetWDef();
				
				if (effect.power > 0 && damage < 0
					|| effect.power < 0 && damage > 0)
					{
						damage = 0;
					}
				
				effect.damage = damage;
				effect.power = undefined;
			}
			recipient.effects.push(effect);
		}
		else
		{
			if ("damage" in effect)
			{
				recipient.currentHealth -= effect.damage;
			}
			if ("power" in effect)
			{
				var damage = sender.GetPower() + effect.power;
				damage -= skilldata.magical ? target.GetMDef() : target.GetWDef();
				recipient.currentHealth -= damage;
			}
			if ("piptrade" in effect && recipient.pip > 0)
			{
				--recipient.pip;
				++sender.pip;
			}
		}
	}
}

// NOTE: turnCounter IS NOT TO BE TRUSTED AFTER THIS FUNCTION.
// THIS FUNCTION SHOULD BE USED ONLY AT THE END OF A TURN.
BattleComponent.prototype.MoveTurn = function(amount)
{
	if (amount == 0) return;	// Not necessary, but wastes less time
	
	var dest = this.turnCounter - amount;
	while (dest < 0)
	{
		dest += this.turnOrder.length;
		// Let's assume we will never move more than one length of turnOrder (solid assumption)
		// We might need to think about mechanics if this becomes unsafe. (Effectively haste for a turn? sorta?)
	}
	
	// Remove current turn-taker, save for later
	var temp = this.turnOrder.splice(this.turnCounter, 1)[0];
	
	// Annnd, reintroduce current turn-taker.
	this.turnOrder.splice(dest, 0, temp);
}

BattleComponent.prototype.GetResultLabel = function()
{
	// FIXME:
	return undefined;
}

/* Constructor
 * Expects player's team references to be on the right. 
 */
function BattleComponent(teamL, allies, triggers)
{
	var enemies = new Array();
	for (enemy in teamL)
	{
		var data = g_GameManager.GameData.GetEnemyData(teamL[enemy]);
		enemies.push(data);
	}

	this.triggers = triggers;	
	this.enemies = enemies;
	this.allies = allies;
	
	this.finished = false;
	// make a copy of teamL, concat teamR to it.
	this.turnOrder = $.merge($.merge([], enemies), allies);
	this.turnCounter = -1;
	this.RandomizeTurnOrder();
	this.NextTurn();
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