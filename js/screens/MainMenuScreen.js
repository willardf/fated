/*
* Update
* Implements GameManager's Screen.Update interface.
* Passes Update up to Menu Component. Finishes if menu is finished.
*/
MainMenuScreen.prototype.Update = function()
{
	this.choiceMenu.Update();
	if (this.choiceMenu.finished)
	{
		g_GameManager.Pop();
	}
}

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
MainMenuScreen.prototype.Render = function(renderer)
{
	this.choiceMenu.Render(renderer);
}

/*
* Unload
* Implements GameManager's Screen.Unload interface.
* Performs finishing actions based on how the menu finished.
*/
MainMenuScreen.prototype.Unload = function()
{
	switch(this.choiceMenu.selected)
	{
		case 0:
		    g_GameManager.Clear();
			var newGameMain = new GameScreen("begin.txt")
			g_GameManager.Push(newGameMain);
			break;
		case 1:
            g_GameManager.Clear();
			$("#outputT").html("Sorry, bro. Not implemented, yet");
			g_GameManager.Push(new MainMenuScreen());
			break;
		default:
			break;
	}
}


// Default constructor
function MainMenuScreen()
{
	var newToString = function(){ return this.text; };
	var menuoptions = 
		[
		{"text" : "New Game", "label" : 0, "toString" : newToString},
		{"text" : "Load Game", "label" : 1, "toString" : newToString},
		{"text" : "Exit", "label" : 2, "toString" : newToString}
		];
	
	this.choiceMenu = new MenuComponent("Main Menu", menuoptions);
}