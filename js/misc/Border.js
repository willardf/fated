Border.prototype.Render = function (renderer)
{
    renderer.drawBox(this.x, this.y, this.w, this.h, true, this.bgColor);

    // long names (Corner, Vert and Hort) are for sources (input picture). First line only
    // short names (c, v, h) are for output. Second line only

    //Left top corner
    renderer.drawSource(this.filename, 0, 0, this.cornerWidth, this.cornerHeight, 
        this.cLeft, this.cTop, this.cornerWidth, this.cornerHeight);

    //Right top corner
    renderer.drawSource(this.filename, this.cornerRight, 0, this.cornerWidth, this.cornerHeight, 
        this.cRight, this.cTop, this.cornerWidth, this.cornerHeight);

    //Left bottom corner
    renderer.drawSource(this.filename, 0, this.cornerBottom, this.cornerWidth, this.cornerHeight, 
        this.cLeft, this.cBottom, this.cornerWidth, this.cornerHeight);

    //Right bottom corner
    renderer.drawSource(this.filename, this.cornerRight, this.cornerBottom, this.cornerWidth, this.cornerHeight, 
        this.cRight, this.cBottom, this.cornerWidth, this.cornerHeight);


    // Left Vertical
    renderer.drawSource(this.filename, 0, this.cornerHeight, this.vertWidth, this.vertHeight,
        this.vLeft, this.vTop, this.vWidth, this.vHeight);
    
    // Right Vertical
    renderer.drawSource(this.filename, this.vertRight, this.cornerHeight, this.vertWidth, this.vertHeight,
        this.vRight, this.vTop, this.vWidth, this.vHeight);

    // Top Horizontal
    renderer.drawSource(this.filename, this.cornerWidth, 0, this.hortWidth, this.hortHeight,
        this.hLeft, this.hTop, this.hWidth, this.hHeight);

    // Bottom Horizontal
    renderer.drawSource(this.filename, this.cornerWidth, this.hortBottom, this.hortWidth, this.hortHeight,
        this.hLeft, this.hBottom, this.hWidth, this.hHeight);

};

Border.prototype.getTextArea = function ()
{
    return { "x": (this.x + this.vWidth), "y": (this.y + this.cHeight), "w": this.hWidth, "h": this.vHeight };
}

Border.prototype.setRect = function(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;

    // TODO: Scale cornersize appropriately
    this.cWidth = this.cornerWidth;
    this.cHeight = this.cornerHeight;
    this.vWidth = this.vertWidth;
    this.hHeight = this.hortHeight;

    this.cLeft = x;
    this.cTop = y;
    this.cRight = width + x - this.cWidth;
    this.cBottom = height + y - this.cHeight;

    this.vLeft = x;
    this.vTop = y + this.cHeight;
    this.vRight = width + x - this.vWidth;
    this.vHeight = height - 2 * this.cHeight;

    this.hLeft = x + this.cWidth;
    this.hTop = y;
    this.hBottom = height + y - this.hHeight;
    this.hWidth = width - 2 * this.cWidth;
};

function Border(filename)
{
    var data = g_FileManager.LoadFromFile("data/borders/" + filename);

    this.filename = data.filename;
    this.bgColor = data.bgcolor;
    this.width = data.width;
    this.height = data.height;
    this.cornerWidth = data.cornerwidth;
    this.cornerHeight = data.cornerheight;

    this.vertWidth = data.vertwidth;
    this.vertHeight = data.height - 2 * data.cornerheight;

    this.hortHeight = data.hortheight;
    this.hortWidth = data.width - 2 * data.cornerwidth;

    this.cornerRight = this.width - this.cornerWidth;
    this.cornerBottom = this.height - this.cornerHeight;
    this.vertRight = this.width - this.vertWidth;
    this.hortBottom = this.height - this.hortHeight;
}