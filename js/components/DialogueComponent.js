/*
* DialogueComponent
* Constructor accepts (prompt)
* prompt: string
*/

DialogueComponent.prototype.GetResult = function()
{
	return {"label" : undefined };
};

/*
* Update
* Implements Component.Update
* Polls for input, reacts.
*/
DialogueComponent.prototype.Update = function()
{
	if (this.finished) return;

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
DialogueComponent.prototype.Render = function(renderer)
{
	if (this.finished) return;

	renderer.drawText(this.prompt);
};

/*
* DialogueComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function DialogueComponent(prompt)
{
	this.prompt = prompt;
	this.finished = false;
}