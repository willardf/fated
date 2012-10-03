BattleComponent.prototype.NextTurn = function()
{ 
	this.EvalTriggers();
	
	this.turnCounter = (this.turnCounter + 1) % this.turnOrder.length;
	var current = this.turnOrder[this.turnCounter];
	
	this.EvalEffects(current, true);
	
	this.SelectSkill();
};

BattleComponent.prototype.EvalTriggers = function()
{
	for (t in this.triggers)
	{
		var trigger = this.triggers[t];
		for (condition in trigger)
		{
			trigger.turnOrder = this.turnOrder;
			if (new Condition(trigger).GetResult())
			{
				this.result = trigger;
				complete = true;
				this.finished = true;
				break;
			}
		}
	}
};

BattleComponent.prototype.SelectSkill = function()
{
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
				"label" : skillname,
				toString : function(){return this.text;}
			};
		skillItems.push(newItem);
	}
	this.menu = new MenuComponent(prompt, skillItems);
	this.menu.label = "skill";
};

BattleComponent.prototype.SelectTarget = function()
{
	//var current = this.turnOrder[this.turnCounter];
	var prompt = "Choose a target";
	var targetItems = new Array();
	for (idx in this.turnOrder)
	{
		if (idx == this.turnCounter) continue;
		
		var targetName = this.turnOrder[idx].name;
		var newItem = {
				"text" : targetName, 
				"label" : idx,
				toString : function(){return this.text;}
			};
		targetItems.push(newItem);
	}
	this.menu = new MenuComponent(prompt, targetItems);
	this.menu.label = "target";
};

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
BattleComponent.prototype.Update = function()
{
	if (this.menu !== undefined)
	{
		this.menu.Update();
		if (this.menu.finished)
		{
			if (this.menu.label == "skill")
			{
				this.skillSelected = this.menu.GetResult().label;
				var current = this.turnOrder[this.turnCounter];
				var skilldata = g_GameManager.GameData.GetSkillData(this.skillSelected);
				if (current.pip < -skilldata.pip)
				{	// Insufficient pips
					this.menu.finished = false;
				}
				else
				{
					this.SelectTarget();
				}
			}
			else if (this.menu.label == "target")
			{
				var target = this.turnOrder[this.menu.GetResult().label];
				if (this.DoSkill(this.skillSelected, target))
				{
					this.NextTurn();
				}
				else
				{
					// Error: Something went wrong?
					this.SelectSkill();
				}				
			}
		}
	}	
};

/*
* Render
* Implements Component.Render
* Displays text.
*/
BattleComponent.prototype.Render = function(renderer)
{
	$("#outputT").html("Battle");
	if (this.menu != undefined)
	{
		this.menu.Render(renderer);
	}
		// FIXME: For testing, represents turn meter thing
	$("#outputB").html(JSON.stringify(this.turnOrder));
};

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
		damage *= Math.round(Math.random() + 0.75);

		// TODO: Handle other damage mods (resist, weakness, absorb
			
		if (skilldata.power > 0 && damage > 0
			|| skilldata.power < 0 && damage < 0)
		{
			target.currenthealth -= damage;
			g_Renderer.LogText(target.name + " takes " + damage + " damage.");
		}
	}
	
	// TODO: Calculate specials and apply
	
	this.ApplyEffects(skilldata.effects, current, target);
	
	// TODO: Immediate reactions
	// TODO: Handle deaths
	// TODO: Add animations to queue
	
	this.MoveTurn(skilldata.speed);
	return true;
};

BattleComponent.prototype.EvalEffects = function(recipient, save)
{
	var effectsList = recipient.effects;
	var eIdx;
	var flavor = " effect ";
	for (eIdx = 0; eIdx < effectsList.length; eIdx++)
	{
		var effect = effectsList[eIdx];
		
		if ("damage" in effect)
		{
			recipient.currentHealth -= effect.damage;
			g_Renderer.LogText(recipient.name + " takes " + effect.damage + " damage.");
			flavor = " damaging effect ";
		}
		if ("power" in effect)
		{
			var damage = sender.GetPower() + effect.power;
			damage -= skilldata.magical ? target.GetMDef() : target.GetWDef();
			recipient.currentHealth -= damage;
			g_Renderer.LogText(recipient.name + " takes " + effect.damage + " damage.");
			flavor = " damaging effect ";
		}
		if ("piptrade" in effect && recipient.pip > 0)
		{
			--recipient.pip;
			++sender.pip;
			g_Renderer.LogText(sender.name + " takes "+effect.piptrade+" pip(s)");
			flavor = " piptrade effect ";
		}
		
		if (save)
		{
			var remove;
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
				g_Renderer.LogText(recipient.name + "'s"+flavor+"wears off.");
				effectsList.splice(eIdx, 1);
				eIdx--;
			}
		}
	}
};

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
				g_Renderer.LogText(target.name + " will take ongoing " + effect.damage);
			}
			recipient.effects.push(effect);
		}
		else
		{
			if ("damage" in effect)
			{
				recipient.currentHealth -= effect.damage;
				g_Renderer.LogText(recipient.name + " takes " + effect.damage + " damage.");
			}
			if ("power" in effect)
			{
				var damage = sender.GetPower() + effect.power;
				damage -= skilldata.magical ? target.GetMDef() : target.GetWDef();
				recipient.currentHealth -= damage;
				g_Renderer.LogText(recipient.name + " takes " + damage + " damage.");
			}
			if ("piptrade" in effect && recipient.pip > 0)
			{
				g_Renderer.LogText(sender.name + " takes "+effect.piptrade+" pip(s)");
				recipient.pip -= effect.piptrade;
				sender.pip += effect.piptrade;
			}
		}
	}
};

// NOTE: turnCounter IS NOT TO BE TRUSTED AFTER THIS FUNCTION.
// THIS FUNCTION SHOULD BE USED ONLY AT THE END OF A TURN.
BattleComponent.prototype.MoveTurn = function(amount)
{
	if (amount == 0) return;	// Not necessary, but wastes less time
	
	var dest = (this.turnCounter - amount) % this.turnOrder.length;
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
};

BattleComponent.prototype.GetResultLabel = function()
{
	return this.result;
};

/* Constructor
 * Expects player's team references to be on the right. 
 */
function BattleComponent(teamL, allies, triggers)
{
	var enemies = new Array();
	for (enemy in teamL)
	{
		var data = g_GameManager.GameData.GetEnemyData(enemy);
		data.name = teamL[enemy];
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
};