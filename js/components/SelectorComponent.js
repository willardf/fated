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
		else
		{
			if (this.numLimit > this.output.length)
			{
				this.output.push(sel);
			}
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
	
	renderer.drawText("<p>Items Chosen<br/>");
	for (x in this.output)
	{
		renderer.drawText((1 + parseInt(x)) + ": " + this.output[x] + "<br/>");		
	}
	renderer.drawText("</p>");
	// TODO: Some kind of selection coloring overlay or something.
}

/*
* SelectorComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function SelectorComponent(prompt, optionsList, numLimit)
{
	this.numLimit = numLimit;
	this.menu = new MenuComponent(prompt, optionsList);
	this.output = new Array();
}