/*
* Load
* Uses AJAX to load a given file that should contain
* scene data.
* Note: Appends "scenes/", so filename should be relative to that path.
* TODO: error doesn't actually seem to work.
*/
GameScreen.prototype.Load = function(filename)
{
	$("#outputM").html("Loading...");
	var ajaxSettings = {
			async: false,
			url: ("scenes/" + filename), 
			context: this,
			success: function(result)
				{
					this.currentScene = result;
				}, 
			error: function(event, request, settings, error)
				{
					$("outputM").html("AJAXError:" + error);
				},
			dataType: "json" 
		};
		
	$.ajax(ajaxSettings);
	g_GameState.scenefile = filename;
}

/*
* Update
* Implements GameManager's Screen.Update interface.
* Checks for inputs based on duck-typed currentEvent. Reacts.
*/
GameScreen.prototype.Update = function()
{
	if ("dialogue" in this.currentEvent)
	{
		// Advance
		if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_SpaceBar))
		{
			this.JumpToEvent();
		}
	}
	else if (this.component != undefined)
	{
		this.component.Update();
		if (this.component.finished)
		{
			this.JumpToEvent(this.component.GetResultLabel());
			this.component = undefined;
		}
	}
}

/*
* LoadEvent
* Performs the actions necessary to update and render this.currentEvent
*/
GameScreen.prototype.LoadEvent = function()
{
	var currentEvent = this.currentScene.p_Events[g_GameState.eventCnt];
	this.currentEvent = currentEvent;
	
	// Non-mutually exclusive checks
	if ("setflag" in currentEvent)
	{
		g_GameState.AddFlag(currentEvent.setflag, true);
	}
	if ("giveskill" in currentEvent)
	{
		g_GameState.AddSkill(currentEvent.giveskill);
	}
	
	// Begin Mutually exclusive checks
	if ("choice" in currentEvent)
	{
		this.component = new MenuComponent(currentEvent.choice, currentEvent.options);
	}
	else if ("battle" in currentEvent)
	{
		this.component = new BattleComponent(currentEvent.enemies, g_GameState.playerTeam);
	}
	else if ("scenefile" in currentEvent)
	{
		this.Load(currentEvent.scenefile);
		if ("sceneevent" in currentEvent)
		{
			this.JumpToEvent(currentEvent.sceneevent);
		}
		else
		{
			this.JumpToEvent(0);
		}
	}
	else if ("jump" in currentEvent)
	{
		this.JumpToEvent(currentEvent.jump);
	}
	else if ("end" in currentEvent)
	{
		g_GameManager.Pop();
	}
}

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
GameScreen.prototype.Render = function()
{
	if ("dialogue" in this.currentEvent)
	{
		$("p#outputM").html(this.currentEvent.dialogue);
	}
	else if (this.component != undefined
		&& this.component.Render != undefined)
	{
		this.component.Render();
	}
}

/*
* JumpToEvent 
* Jumps to supplied string label or scene index.
*/
GameScreen.prototype.JumpToEvent = function(label)
{
	if (label == undefined)
	{
		++g_GameState.eventCnt;
	}
	else if (isNaN(label))
	{
		g_GameState.eventCnt = 0;
		while (true)
		{
			var currentEvent = this.currentScene.p_Events[g_GameState.eventCnt];
			if ("end" in currentEvent ||
				("label" in currentEvent && currentEvent.label == label))
			{
				break;
			}
			else
			{
				++g_GameState.eventCnt;
			}
		}
	}
	else
	{
		g_GameState.eventCnt = label;
	}
	this.LoadEvent();
}

/*
* GameScreen Constructor
* Loads a file, starts the scene.
*/
function GameScreen(filename)
{
	g_GameState.eventCnt = 0;
	this.Load(filename + "?" + new Date().getTime());
	this.LoadEvent();
}