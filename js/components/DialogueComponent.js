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

    this.border.Render(renderer);

    var fontHeight = renderer.getFontHeight();
    var numLines = Math.floor(this.height / fontHeight);

    var area = this.border.getTextArea();

	var locY = area.y + 2;
	renderer.drawText(this.prompt, area.x, locY);
};

/*
* DialogueComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function DialogueComponent(prompt, locX, locY, width, height)
{
    this.border = new Border("Boreder1.txt");
    this.border.setRect(locX, locY, width, height);

    this.X = locX;
    this.Y = locY;
    this.width = width;
    this.height = height;

	this.prompt = prompt;
	this.finished = false;
}