/*
* MenuComponent
* Constructor accepts (prompt, menuitems)
* prompt: string
* menuitems: 
[
	{
		toString() 
		(optional, recommended) "label" : string, 
		(optional) "conditions" : ["key" : ##, ...]
	}, ...
]
where key is a key in g_GameState.flags
*/

MenuComponent.prototype.GetResult = function()
{
	return this.options[this.selected];
};

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
MenuComponent.prototype.Update = function()
{
	if (this.finished) return;

	if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_UpArrow))
		--this.selected;
	if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_DownArrow))
		++this.selected;

	// Clamp to size of list
	this.selected = Math.max(0, Math.min(this.selected, this.options.length - 1));

	if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_SpaceBar))
	{
		this.finished = true;
	}
};

/*
* Render
* Implements Component.Render
* Displays text.
*/
MenuComponent.prototype.Render = function(renderer)
{
    if (this.finished) return;

    this.border.render(renderer);
    var area = this.border.getTextArea();

	var fontHeight = renderer.getFontHeight();

	renderer.drawText(this.prompt, area.x, area.y);

	for (obj = 0; obj < this.options.length; obj++)
	{
		var option = this.options[obj];
		var y = (obj + 1) * fontHeight + area.y;

		if (option.ToString != undefined)
		{
			renderer.drawText(option.ToString(), area.x, y);
		}
		else
		{
		    renderer.drawText(option, area.x, y);
		}
	}

	var locY = (this.selected + 1) * fontHeight + area.y + 2;
	renderer.drawBox(area.x, locY, area.w, fontHeight, true, "rgba(0,0,255,0.25)");
};

/*
* MenuComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function MenuComponent(prompt, optionsList, locX, locY, width, height)
{
    this.border = new Border("Boreder1.txt");
    this.border.setRect(locX, locY, width, height);

    this.X = locX;
    this.Y = locY;
    this.width = width;
    this.height = height;

	this.prompt = prompt;
	this.selected = 0;
	this.options = optionsList;
	this.finished = false;
	for (var i = 0; i < this.options.length; ++i)
	{
		var option = this.options[i];
		if (option.conditions != undefined)
		{
			for (var o = option.conditions.length - 1; o >= 0; --o)
			{
				var condition = option.conditions[o];
				// If condition is false, we remove the option
				if (!new Condition(condition).GetResult())
				{
					this.options.splice(i, 1);
					break;
				}
			}
		}
	}
}