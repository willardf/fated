/*
* Load
* Uses AJAX to load a given file that should contain
* scene data.
* Note: Appends "data/scenes/", so filename should be relative to that path.
*/
GameScreen.prototype.Load = function(filename)
{
	$("#outputM").html("Loading...");
	this.currentScene = g_FileManager.LoadFromFile("data/scenes/" + filename);
	g_GameState.scenefile = filename;
};

/*
* Update
* Implements GameManager's Screen.Update interface.
* Checks for inputs based on duck-typed currentEvent. Reacts.
*/
GameScreen.prototype.Update = function()
{
	if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_Escape))
	{
		g_GameManager.Push(new GameMenuScreen());
	}
	else if (this.component != undefined)
	{
		this.component.Update();
		if (this.component.finished)
		{
			var label = this.component.GetResult().label;
			this.component = undefined;
			this.JumpToEvent(label);
		}
	}
};

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
		g_GameState.AddFlag(currentEvent.setflag.flag, currentEvent.setflag.val);
	}
	if ("giveskill" in currentEvent)
	{
		g_GameState.AddSkill(currentEvent.giveskill);
	}
	if ("giveskills" in currentEvent)
	{
	    for (e in currentEvent.giveskills)
	    {
	        g_GameState.AddSkill(currentEvent.giveskills[e]);
	    }
	}
	if ("giveally" in currentEvent)
	{
		g_GameState.AddAlly(currentEvent.giveally);
	}
	if ("giveitem" in currentEvent)
	{
	    g_GameState.AddItem(currentEvent.giveitem);
	}
	
	// Begin Mutually exclusive checks
	if ("dialogue" in currentEvent)
	{
	    var width = g_Renderer.getWidth();
	    var height = this.c_Height3rd;
	    var y = this.c_Height3rd * 2;
		this.component = new DialogueComponent(currentEvent.dialogue, currentEvent.speaker, 0, y, width, height);
	}
	else if ("choice" in currentEvent)
	{
		for (o in currentEvent.options)
		{
			currentEvent.options[o].ToString = function()
			{
				return this.text;
			};
		}
		var width = g_Renderer.getWidth();
		var height = this.c_Height3rd;
		var y = this.c_Height3rd * 2;
		this.component = new MenuComponent(currentEvent.choice, currentEvent.options, 0, y, width, height);
	}
	else if ("battle" in currentEvent)
	{
	    this.component = new BattleStartComponent(currentEvent, g_Renderer.getWidth(), g_Renderer.getHeight());
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
};

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
GameScreen.prototype.Render = function(renderer)
{
    if ("background" in this.currentScene)
    {
        renderer.drawImage(this.currentScene.background, 0, 0, renderer.getWidth(), renderer.getHeight());
    }

	if (this.component != undefined
		&& this.component.Render != undefined)
	{
		this.component.Render(renderer);
	}
};

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
};

/*
* GameScreen Constructor
* Loads a file, starts the scene.
*/
function GameScreen(filename)
{
    this.c_Height3rd = g_Renderer.getHeight() / 3;

	g_GameState.eventCnt = 0;
	this.Load(filename + "?" + new Date().getTime());
	this.LoadEvent();
}