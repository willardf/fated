/*
* Update
* Implements GameManager's Screen.Update interface.
* Passes Update up to Menu Component. Finishes if menu is finished.
*/
GameMenuScreen.prototype.Update = function()
{
    if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_Escape))
    {
        g_GameManager.Pop();
        return;
    }

	this.choiceMenu.Update();
	if (this.choiceMenu.finished)
	{
		switch(this.choiceMenu.GetResult().label)
	    {
		    case 0:
		        g_GameManager.Push(new EquipmentScreen());
		        this.choiceMenu.finished = false;
		        break;

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
	$("#outputR").html(JSON.stringify(g_GameState.playerTeam))
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
    this.width = g_Renderer.getWidth();
    this.height = g_Renderer.getHeight();

	var newToString = function(){ return this.text; };
	var menuoptions = 
		[
		{"text" : "Equipment", "label" : 0, "toString" : newToString},
		{"text" : "Save", "label" : 1, "toString" : newToString},
		{"text" : "Return", "label" : 2, "toString" : newToString}
		];
	
	this.choiceMenu = new MenuComponent("Menu", menuoptions, 0, 0, this.width / 4, this.height / 2);
}