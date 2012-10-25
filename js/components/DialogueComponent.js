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
	    if (this.start + this.linesMax >= this.promptLines.length)
	    {
	        this.finished = true;
	    }
	    else
	    {
	        this.start++;
	    }
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
	    var portArea = this.portraitBorder.getTextArea();
	    locX += portArea.w
	    renderer.drawImage("characters/" + this.speaker + "portrait.png", portArea.x, portArea.y, portArea.w, portArea.h);
	}

	for (var line = this.start; line < this.promptLines.length && line - this.start < this.linesMax; line++)
	{
	    renderer.drawText(this.promptLines[line], locX, locY + (line - this.start) * fontHeight);
	}

	if (this.start + this.linesMax < this.promptLines.length)
	{
	    renderer.drawImage("downarrow.png", area.x + area.w / 2, locY + this.linesMax * fontHeight, fontHeight * 2, fontHeight);
	}
};

DialogueComponent.prototype.WordWrap = function (text, width)
{
    var width = width || 75;

    var split = text.split(" ");
    var output = new Array();

    var len = 0;
    var last = 0;
    for (var i = 0; i < split.length; i++)
    {
        if (len + split[i].length > width)
        {
            output.push(split.slice(last, i).join(" "));
            last = i;
            len = split[i].length;
        }
        else
        {
            len += split[i].length;
        }
    }
    output.push(split.slice(last).join(" "));
    return output;
};

/*
* DialogueComponent Constructor
* Sets stuff up, prunes via conditions.
*/
function DialogueComponent(prompt, speaker, locX, locY, width, height)
{
    this.start = 0;
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

        var textWidth = this.border.getTextArea().w;// - this.portraitBorder.getTextArea().w;
    }
    else
    {
        this.border = new Border("boreder1.txt");
        this.border.setRect(locX, locY, width, height);

        var textWidth = this.border.getTextArea().w;
    }

    this.prompt = prompt;
    this.promptLines = this.WordWrap(prompt, textWidth / g_Renderer.getFontWidth());
    this.linesMax = Math.floor(this.border.getTextArea().h / g_Renderer.getFontHeight()) - 1;

	this.finished = false;
}