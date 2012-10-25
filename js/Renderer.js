/**
 * @author Forest
 */

Renderer.prototype.drawText = function(text, locX, locY)
{
    // TODO: Testing
    this.midtext += text;

    locY += this.fontHeight;
    this.gContext.fillStyle = "rgba(0,0,0,1)";
    this.gContext.fillText(text, locX, locY);
};

Renderer.prototype.drawSource = function (filename, srcX, srcY, srcWth, srcHt, locX, locY, width, height)
{
    if (filename in this.images)
    {
        if (this.images[filename].complete)
        {
            this.gContext.drawImage(this.images[filename], srcX, srcY, srcWth, srcHt, locX, locY, width, height);
        }
    }
    else
    {
        var image = new Image();
        image.src = "images/" + filename;
        this.images[filename] = image;
    }
}

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
        image.src = "images/" + filename;
        this.images[filename] = image;
    }
};

Renderer.prototype.Save = function ()
{
    this.gContext.save();
};
Renderer.prototype.Restore = function ()
{
    this.gContext.restore();
};

Renderer.prototype.createGradient = function (x1, y1, x2, y2, stops)
{
    var grd = this.gContext.createLinearGradient(x1, y1, x2, y2);
    for (sPt in stops)
    {
        grd.addColorStop(sPt, stops[sPt]);
    }
    return grd;
}

Renderer.prototype.setMirror = function (flipX, flipY, aboutX, aboutY)
{
    this.flipX = flipX;

    this.gContext.translate(aboutX, aboutY);
    this.gContext.scale(flipX ? -1 : 1, flipY ? -1 : 1);
};

Renderer.prototype.LogText = function(text)
{
	$("#log").append(text + "<br/>");
};

Renderer.prototype.getFontHeight = function ()
{
    return this.fontHeight;
};
Renderer.prototype.getFontWidth = function ()
{
    return this.fontWidth;
};

Renderer.prototype.calcFontWidth = function (text)
{
    var f = this.gContext.font;
    o = $('<div>' + text + '</div>')
            .css({ 'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f })
            .appendTo($('body'));
    w = o.width();
    o.remove();

    return w;
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
    this.images = {};
    
    this.gCanvas = document.getElementById("myCanvas");
    this.gContext = this.gCanvas.getContext("2d");

    // TODO: Testing
    this.midtext = "";

    this.fontHeight = 14;
    this.gContext.font = this.fontHeight + "px Times New Roman";
    this.fontWidth = this.calcFontWidth("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ") / 52;
}
