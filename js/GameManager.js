/*
* Update
* Implements GameManager's Screen.Update interface.
*/
GameManager.prototype.Update = function()
{
	// TODO: This should actually raise an error
	if (this.i_stack.length == 0)
	{
		$("p#outputM").html("GameManager Empty");
		return;
	}

	var top = this.i_stack[this.i_stack.length - 1];
	top.Update();

};

/*
* Push, Pop, Top, Clear
* External stack methods.
*/
GameManager.prototype.Push = function(obj)
{
	this.i_stack.push(obj);
};

GameManager.prototype.Pop = function()
{
	if (this.i_stack.length > 0)
	{
		var top = this.i_stack[this.i_stack.length - 1];
		this.i_stack.pop();
		
		if (top.Unload != undefined)
		{
			top.Unload();
		}
	}
};

GameManager.prototype.Top = function()
{
	if (this.i_stack.length > 0)
	{
		return this.i_stack[this.i_stack.length - 1];
	}
	else
	{
		return undefined;
	}
};

GameManager.prototype.Clear = function()
{
	this.i_stack = new Array();
};

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
GameManager.prototype.Render = function(renderer)
{
	// TODO: This should actually raise an error
	if (this.i_stack.length == 0)
	{
		renderer.drawText("GameManager Empty");
		return;
	}

	var top = this.i_stack[this.i_stack.length - 1];
	if (top.Render != undefined)
	{
		top.Render(renderer);
	}
};

/*
* GameManager Constructor
* 
*/
function GameManager()
{
	// VariableMemebers
	this.i_stack = new Array();
}