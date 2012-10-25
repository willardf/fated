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
    var locX = area.x;

	if (this.speaker != undefined)
	{
	    this.portraitBorder.Render(renderer);
	    var area = this.portraitBorder.getTextArea();
	    locX += area.w
	    renderer.drawImage("characters/" + this.speaker + "portrait.png", area.x, area.y, area.w, area.h);
	}

	renderer.drawText(this.prompt, locX, locY);
};

/*
* DialogueComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function DialogueComponent(prompt, speaker, locX, locY, width, height)
{

    this.X = locX;
    this.Y = locY;
    this.width = width;
    this.height = height;
    this.speaker = speaker;

    if (speaker != undefined)
    {
        var hScale = this.height / 7;

        this.portraitBorder = new Border("boreder1.txt");
        this.portraitBorder.setRect(locX, locY, hScale * 6, hScale * 6);

        this.border = new Border("boreder1.txt");
        this.border.setRect(locX + hScale, locY + hScale, width - hScale, hScale * 6);
    }
    else
    {
        this.border = new Border("boreder1.txt");
        this.border.setRect(locX, locY, width, height);
    }

	this.prompt = prompt;
	this.finished = false;
}