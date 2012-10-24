StatusComponent.prototype.Update = function ()
{
    // Nothing... yet?
}

StatusComponent.prototype.Render = function (renderer)
{
    this.border.Render(renderer);
    var area = this.border.getTextArea();

    var fontHeight = renderer.getFontHeight();

    for (cIdx = 0; cIdx < this.characters.length; cIdx++)
    {
        var char = this.characters[cIdx];
        var y = area.y + cIdx * fontHeight;
        var text = char.name + ": " + char.currenthealth + "/" + char.GetHealth() + "HP\t\tPips: " + char.pip;

        renderer.drawText(text, area.x, y);
    }
}

function StatusComponent(characters, locX, locY, width, height)
{
    this.border = new Border("Boreder1.txt");
    this.border.setRect(locX, locY, width, height);

    this.X = locX;
    this.Y = locY;
    this.width = width;
    this.height = height;

    this.characters = characters;
}