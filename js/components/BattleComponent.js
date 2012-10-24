BattleComponent.prototype.NextTurn = function()
{ 
	this.EvalTriggers();
	
	// TODO: Exhaustion
	do
	{
		this.turnCounter = (this.turnCounter + 1) % this.turnOrder.length;
		var current = this.turnOrder[this.turnCounter];
	} while(current.currenthealth <= 0);
	
	$("#outputL").html(current.name);
	
	this.EvalEffects(current, true);
	
	if (current.IsStunned()) 
	{
		// TODO: Handle the stunned animations and whatnot
		this.NextTurn();
	}
	
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
	var prompt = "Choose a skill, " + current.name + ".";
	var skillItems = new Array();
	for (skillidx in current.skills)
	{
		var skillname = current.skills[skillidx];
		// "PowerName" : { "pip" : -1, "power" : 5, "magical" : true, "speed" : 1}
		var skillData = g_GameData.GetSkillData(skillname);
		var newItem = {
				"text" : skillname + " [" + skillData.pip + "]", 
				"label" : skillname,
				toString : function(){return this.text;}
			};
		skillItems.push(newItem);
	}
	this.component = new MenuComponent(prompt, skillItems, 0, this.height3rd * 2, this.width / 2, this.height3rd);
	this.component.label = "skill";
};

BattleComponent.prototype.SelectTarget = function()
{
	//var current = this.turnOrder[this.turnCounter];
	var prompt = "Choose a target";
	var targetItems = new Array();
	for (idx in this.turnOrder)
	{
		if (idx == this.turnCounter ||
			this.turnOrder[idx].currenthealth <= 0) continue;
		
		var targetName = this.turnOrder[idx].name;
		var newItem = {
				"text" : targetName, 
				"label" : idx,
				toString : function(){return this.text;}
			};
		targetItems.push(newItem);
	}
	this.component = new MenuComponent(prompt, targetItems, 0, this.height3rd * 2, this.width / 2, this.height3rd);
	this.component.label = "target";
};

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
BattleComponent.prototype.Update = function()
{
	if (this.component !== undefined)
	{
		this.component.Update();
		if (this.component.finished)
		{
			if (this.component.label == "skill")
			{
				this.skillSelected = this.component.GetResult().label;
				var current = this.turnOrder[this.turnCounter];
				var skilldata = g_GameData.GetSkillData(this.skillSelected);
				if (current.pip < -skilldata.pip)
				{	// Insufficient pips
					this.component.finished = false;
				}
				else
				{
					this.SelectTarget();
				}
			}
			else if (this.component.label == "target")
			{
				var target = this.turnOrder[this.component.GetResult().label];
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
	if (this.component != undefined)
	{
		this.component.Render(renderer);
	}

	this.statusComponent.Render(renderer);

	// FIXME: For testing, represents turn meter thing
	//$("#outputB").html(JSON.stringify(this.turnOrder));
};

BattleComponent.prototype.Unload = function()
{
	for (cIdx in this.turnOrder)
	{
		var c = this.turnOrder[cIdx];
		c.currenthealth = c.GetHealth();
	}
}

// Validates skill, returns success
BattleComponent.prototype.DoSkill = function(skillname, target)
{
	var skilldata = g_GameData.GetSkillData(skillname);
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
	
	if (current.IsBlinded() && Math.random() < .5) 
	{
		// TODO: Handle "you missed" case with animations or something
		return true;
	}
	
	var damage = 0;
	if (skilldata.power != 0)
	{
		damage = current.GetPower() + skilldata.power;
		damage -= (skilldata.magical ? target.GetMDef() : target.GetWDef());
		
		// TODO: Handle other damage mods (resist, weakness, absorb
		var mod = current.IsWeakened() ? 1 : .5;
		
		// Random Range = .75 to 1.75
		damage = Math.round(damage * (Math.random() + 0.75) * mod);		
		
		// Force that we aren't doing less than 1 dmg or healing.
		var pwrSign = skilldata.power >= 0 ? 1 : -1;
		var dmgSign = damage > 0 ? 1 : -1;
		if (pwrSign != dmgSign)
		{
			damage = pwrSign;
		}
		
		target.currenthealth -= damage;
		g_Renderer.LogText(target.name + " takes " + damage + " damage.");
	}
	
	// TODO: Calculate specials and apply
	
	this.ApplyEffects(skilldata.effects, current, target);
	
	// TODO: Immediate reactions
	
	if (target.currenthealth <= 0)
	{
		g_Renderer.LogText(target.name + " has perished.");
	}
	
	// TODO: Add animations to queue
	
	this.MoveTurn(skilldata.speed);
	return true;
};

BattleComponent.prototype.EvalEffects = function(recipient, save, effects)
{
	var effectsList = (effects != undefined ? effects : recipient.effects);
	var eIdx;
	var flavor = " effect ";
	for (eIdx = effectsList.length - 1; eIdx >= 0; eIdx--)
	{
		var effect = effectsList[eIdx];
		
		var skilleffect = new SkillEffect(effect);
		skilleffect.ApplyEffect(recipient, effect.sender);
		if (save)
		{
			if (skilleffect.Save())
			{
				g_Renderer.LogText(recipient.name + "'s" + flavor + "wears off.");
				effectsList.splice(eIdx, 1);
			}
		}
		
	}
};

BattleComponent.prototype.ApplyEffects = function(effectsList, current, target)
{
	for (eIdx in effectsList)
	{
		var effect = $.extend({}, effectsList[eIdx]);
		effect.sender = ("self" in effect) ? target : current;
		var recipient = ("self" in effect) ? current : target;
		
		if ("ongoing" in effect)
		{
			g_Renderer.LogText(target.name + " will take ongoing " + effect.damage);
			recipient.effects.push(effect);
		}
		else
		{
			this.EvalEffects(recipient, false, [effect]);
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
function BattleComponent(teamL, allies, triggers, screenwidth, screenheight)
{
    this.width = screenwidth;
    this.height = screenheight;
    this.height3rd = screenheight / 3;

    this.statusComponent = new StatusComponent(allies,
        this.width / 2, this.height3rd * 2, this.width / 2, this.height3rd);

	var enemies = new Array();
	for (enemy in teamL)
	{
		var data = g_GameData.GetEnemyData(enemy);
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