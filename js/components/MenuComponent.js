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

	renderer.drawText(this.prompt);
	for (obj in this.options)
	{
		var option = this.options[obj];
		
		if (option.ToString != undefined)
		{
			renderer.drawText("</br>" + option.ToString());
		}
		else
		{
			renderer.drawText("</br>" + option);
		}
	}
	if (option.ToString != undefined)
	{
		renderer.drawText("</br>Selected: " +
			this.options[this.selected].ToString());
	}
	else
	{
		renderer.drawText("</br>Selected: " +
			this.options[this.selected]);
	}
	
};

/*
* MenuComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function MenuComponent(prompt, optionsList)
{
	this.prompt = prompt;
	this.selected = 0;
	this.options = optionsList;
	this.finished = false;
	for (var i = 0; i < this.options.length; ++i)
	{
		var option = this.options[i];
		if (option.conditions != undefined)
		{
			for (var o = 0; o < option.conditions.length; ++o)
			{
				var condition = option.conditions[o];
				// If condition is false, we remove the option
				if (!new Condition(condition).GetResult())
				{
					this.options.splice(i, 1);
					--i;
					break;
				}
			}
		}
	}
}