TurnOrderComponent.prototype.Update = function (currentTurn)
{
    this.currentTurn = currentTurn;
}

TurnOrderComponent.prototype.Render = function (renderer)
{
    this.border.Render(renderer);
    var area = this.border.getTextArea();

    var fontHeight = renderer.getFontHeight();

    for (cIdx = 0; cIdx < this.turnOrder.length; cIdx++)
    {
        var cIdx2 = (cIdx + this.currentTurn) % this.turnOrder.length;
        var char = this.turnOrder[cIdx2];

        var y = area.y + cIdx * fontHeight;
        var text = char.name;

        renderer.drawText(text, area.x, y);
    }
}

function TurnOrderComponent(turnOrder, locX, locY, width, height)
{
    this.border = new Border("boreder1.txt");
    this.border.setRect(locX, locY, width, height);

    this.X = locX;
    this.Y = locY;
    this.width = width;
    this.height = height;

    this.currentTurn = 0;
    this.turnOrder = turnOrder;
}