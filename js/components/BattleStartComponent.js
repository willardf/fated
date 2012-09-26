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
			this.component = new BattleComponent(this.enemies, g_GameState.playerTeam, this.triggers);
		}
	}
	else
	{
		if (this.component.finished)
		{
			// Battles over
			this.finished = true;
		}
	}
}

/*
* Render
* Implements Component.Render
* Displays text.
*/
BattleStartComponent.prototype.Render = function()
{
	if (this.finished) return;
	
	if (this.component != undefined)
	{
		this.component.Render();
	}
}

/* Default Constructor
 *  
 */
function BattleStartComponent(battleinfo)
{	
	this.enemies = battleinfo.enemies;
	this.triggers = battleinfo.triggers;
	
	this.finished = false;
	this.component = new SelectorComponent("Choose your battle skills", g_GameState.skillsAvailable, g_GameState.playerCharacter.skillsLimit);
}