/*
* Update
* Implements GameManager's Screen.Update interface.
* Passes Update up to Menu Component. Finishes if menu is finished.
*/
EquipmentScreen.prototype.Update = function ()
{
    this.choiceMenu.Update();
    if (this.choiceMenu.finished)
    {
        switch (this.choiceMenu.selected)
        {
            case 2:
                g_GameManager.Pop();
                break;

            default:
                $("#outputT").html("Sorry, bro. " + this.choiceMenu.select + " Not implemented, yet");
                this.choiceMenu.finished = false;
                break;
        }
    }
}

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
EquipmentScreen.prototype.Render = function (renderer)
{
    this.choiceMenu.Render(renderer);
    $("#outputR").html(JSON.stringify(g_GameState.playerTeam))
}

/*
* Unload
* Implements GameManager's Screen.Unload interface.
* Performs finishing actions based on how the menu finished.
*/
EquipmentScreen.prototype.Unload = function ()
{
    // Nothing right now
}


// Default constructor
function EquipmentScreen()
{
    var newToString = function () { return this.text; };
    var menuoptions = [];

    for (cIdx in g_GameState.playerTeam)
    {
        var character = g_GameState.playerTeam[cIdx];
        var item = new Object();
        item.text = character.name;
        item.ToString = function () { return this.text; }
        item.label = character;
    }


    this.choiceMenu = new MenuComponent("Equipment", menuoptions);
}