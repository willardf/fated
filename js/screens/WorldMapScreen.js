/*
* Update
* Implements GameManager's Screen.Update interface.
* Checks for inputs based on duck-typed currentEvent. Reacts.
*/
WorldMapScreen.prototype.Update = function()
{
    if (g_InputManager.IsKeyUniqueDown(g_InputManager.c_Escape))
    {
        g_GameManager.Push(new GameMenuScreen());
    }
    else if (this.component != undefined)
    {
        this.component.Update();
        if (this.component.finished)
        {
            g_GameManager.Pop();
            var res = this.component.GetResult();
            var newScreen = new GameScreen(res.dest);
            g_GameManager.Push(newScreen);
        }
    }
};

/*
* Render
* Implements GameManager's Screen.Render interface.
*/
WorldMapScreen.prototype.Render = function(renderer)
{
    var loaded = true;
    loaded &= renderer.isImageLoaded(this.mapData.image);

    for (i in this.component.options)
    {
        loaded &= renderer.isImageLoaded(this.component.options[i].image);
    }

    if (loaded)
    {
        renderer.drawImage(this.mapData.image,
            0, 0, renderer.getWidth(), renderer.getHeight());

        var select = this.component.GetResult();
        renderer.drawBox(0, select.y + select.h / 2, this.width, 4, true, "#000000");
        renderer.drawBox(select.x + select.w / 2, 0, 4, this.height, true, "#000000");

        for (i in this.component.options)
        {
            var icon = this.component.options[i];
            renderer.drawImage(icon.image, icon.x, icon.y, icon.h, icon.w);
        }

        this.component.Render(renderer);
    }
    else
    {
        renderer.drawText("Loading...", 0, 0);
    }
};

/*
* WorldMapScreen Constructor
* Loads a file, starts the scene.
*/
function WorldMapScreen(filename)
{
    this.width = g_Renderer.getWidth();
    this.height = g_Renderer.getHeight();
    this.c_Height3rd = g_Renderer.getHeight() / 3;

    this.mapData = g_FileManager.LoadFromFile("data/worldmap.txt");
    this.mapData.image = "worldmap/" + this.mapData.image;
    for (i in this.mapData.choices)
    {
        this.mapData.choices[i].image = "worldmap/" + this.mapData.choices[i].image;
        this.mapData.choices[i].ToString = function() { return this.label };
    }
    
    var width = g_Renderer.getWidth();
    var height = this.c_Height3rd;
    var y = this.c_Height3rd * 2;
    this.component = new MenuComponent("Select your destination:", this.mapData.choices, 0, y, width, height);
}