/*
* SelectorComponent
* Constructor accepts (prompt, menuitems, numlimit)
* prompt: string
* menuitems: 
[
	{
		"text" : string, 
		"label" : string, 
		(optional) "conditions" : ["key" : ##, ...]
	}, ...
]
where key is a key in g_GameState.flags
*/

SelectorComponent.prototype.GetResultList = function()
{
	return this.output;
}

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
SelectorComponent.prototype.Update = function()
{
	if (this.finished) return;

	this.menu.Update();
	
	if (this.menu.finished)
	{
		this.menu.finished = false;
		var sel = this.menu.GetResult();
		var idx = this.output.indexOf(sel);
		if (idx > -1)
		{
			this.output.splice(idx, 1);
		}
		else if (this.numLimit > this.output.length)
		{
			this.output.push(sel);
		}
	}

	if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_Enter))
	{
		this.finished = true;
	}
}

/*
* Render
* Implements Component.Render
* Displays text. Strongly depends on MenuComponent
*/
SelectorComponent.prototype.Render = function(renderer)
{
	if (this.finished) return;
	this.menu.Render(renderer);

	var fontHeight = renderer.getFontHeight();
	var area = this.menu.border.getTextArea();

	for (x in this.output)
	{
	    var y = (this.options.indexOf(this.output[x]) + 1) * fontHeight + area.y + 2;
        
		renderer.drawBox(area.x, y, area.w, fontHeight, true, "rgba(0, 255, 0, .25)");
	}
}

/*
* SelectorComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function SelectorComponent(prompt, optionsList, numLimit, locX, locY, width, height)
{
    this.X = locX;
    this.Y = locY;
    this.width = width;
    this.height = height;

    this.numLimit = numLimit;
    this.options = optionsList;
	this.menu = new MenuComponent(prompt, optionsList, locX, locY, width, height);
	this.output = new Array();
}