/*
* Update
* Implements GameManager's Screen.Update interface.
* Passes Update up to Menu Component. Finishes if menu is finished.
*/
GameMenuScreen.prototype.Update = function()
{
	this.choiceMenu.Update();
	if (this.choiceMenu.finished)
	{
		switch(this.choiceMenu.selected)
		{
			case 2:
				g_GameManager.Pop();
				break;
			
			default:
				$("#outputT").html("Sorry, bro. "+ this.choiceMenu.select+" Not implemented, yet");
				this.choiceMenu.finished = false;
				break;
		}
	}
}

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
GameMenuScreen.prototype.Render = function(renderer)
{
	this.choiceMenu.Render(renderer);
}

/*
* Unload
* Implements GameManager's Screen.Unload interface.
* Performs finishing actions based on how the menu finished.
*/
GameMenuScreen.prototype.Unload = function()
{
	// Nothing right now
}


// Default constructor
function GameMenuScreen()
{
	var newToString = function(){ return this.text; };
	var menuoptions = 
		[
		{"text" : "Equipment", "label" : 0, "toString" : newToString},
		{"text" : "Save", "label" : 1, "toString" : newToString},
		{"text" : "Return", "label" : 2, "toString" : newToString}
		];
	
	this.choiceMenu = new MenuComponent("Main Menu", menuoptions);
}