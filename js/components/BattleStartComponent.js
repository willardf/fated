/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
// TODO: This...
BattleStartComponent.prototype.Update = function()
{
	this.component.Update();
	if (this.component.GetResultList != undefined)
	{
		if (this.component.finished)
		{
			g_GameState.playerCharacter.skills = this.component.GetResultList();
			this.component = new BattleComponent(this.enemies, g_GameState.playerTeam, this.triggers, this.width, this.height);
		}
	}
	else
	{
		if (this.component.finished)
		{
			// Battles over
			this.component.Unload();
			this.finished = true;
		}
	}
};

BattleStartComponent.prototype.GetResult = function()
{
	return this.component.GetResultLabel();
};

/*
* Render
* Implements Component.Render
* Displays text.
*/
BattleStartComponent.prototype.Render = function(renderer)
{
	if (this.finished) return;
	
	if (this.component != undefined)
	{
		this.component.Render(renderer);
	}
};

/* Default Constructor
 *  
 */
function BattleStartComponent(battleinfo, screenWidth, screenHeight)
{
    this.width = screenWidth;
    this.height = screenHeight;

	this.enemies = battleinfo.enemies;
	this.triggers = battleinfo.triggers;
	
	this.finished = false;

	var locX = 0;
	var locY = screenHeight * (2.0 / 3.0);
	var width = screenWidth;
	var height = screenHeight / 3;
	this.component = new SelectorComponent("Choose your battle skills", g_GameState.skillsAvailable,
        g_GameState.playerCharacter.skillsLimit, locX, locY, width, height);
}