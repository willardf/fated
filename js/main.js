var c_FPS = 60;

// Static Globals
g_FileManager = new FileManager();
g_GameManager = new GameManager();
g_GameState = new GameState();
g_InputManager = new InputManager();
g_TimeManager = new TimeManager();
g_Renderer = new Renderer();
g_GameData = new GameData();

// Stuff run before game starts
function init()
{
	// Start the game
	var newMainMenu = new MainMenuScreen();
	g_GameManager.Push(newMainMenu);
}

function update(frameTime)
{
	$("p#fps").html(Math.round(1/frameTime) + "FPS");
	
	// Update "static global" things
	g_GameManager.Update();
	g_InputManager.Update();

	g_Renderer.Start();
	g_GameManager.Render(g_Renderer);
	g_Renderer.Finish();
}

$(document).ready(
function ()
{
	// Set up stuff
	init();

	// Begin game loop
	g_TimeManager.Begin(update);
});