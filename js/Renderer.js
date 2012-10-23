/**
 * @author Forest
 */

Renderer.prototype.drawText = function(text, locX, locY)
{
    this.midtext += text;

    //locX = 0; locY = 0;

    locY += this.fontHeight;
    this.gContext.fillStyle = "rgba(0,0,0,1)";
    this.gContext.fillText(text, locX, locY);
};

Renderer.prototype.drawBox = function (locX, locY, width, height, fill, color)
{
    if (fill)
    {
        this.gContext.fillStyle = color;
        this.gContext.fillRect(locX, locY, width, height);
        this.gContext.fillStyle = "rgba(0,0,0,1)";
    }
    else
    {
        this.gContext.strokeStyle = color;
        this.gContext.strokeRect(locX, locY, width, height);
        this.gContext.strokeStyle = "rgba(0,0,0,1)";
    }

    
}

Renderer.prototype.drawImage = function (filename, locX, locY, height, width)
{
    if (filename in this.images)
    {
        if (this.images[filename].complete)
        {
            this.gContext.drawImage(this.images[filename], locX, locY, height, width);
        }
    }
    else
    {
        var image = new Image();
        image.src = filename;
        this.images[filename] = image;
    }
}

Renderer.prototype.LogText = function(text)
{
	$("#log").append(text + "<br/>");
};

Renderer.prototype.getFontHeight = function ()
{
    return this.fontHeight;
};

Renderer.prototype.getWidth = function ()
{
    return this.gCanvas.width;
};

Renderer.prototype.getHeight = function ()
{
    return this.gCanvas.height;
};

Renderer.prototype.Start = function ()
{
    this.gContext.fillStyle = "#FF0000";
    this.gContext.fillRect(0, 0, this.gCanvas.width, this.gCanvas.height);
    this.midtext = "";
};

Renderer.prototype.Finish = function()
{
    $("#outputM").html(this.midtext);
};

function Renderer()
{
    this.images = new Object();
    this.fontHeight = 14;

    this.gCanvas = document.getElementById("myCanvas");
    this.gContext = this.gCanvas.getContext("2d");
    this.midtext = "";
    this.gContext.font = this.fontHeight + "px Times New Roman";
}
