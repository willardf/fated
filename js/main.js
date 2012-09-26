var c_FPS = 60;

// Static Globals
var g_GameManager;
var g_GameState;
var g_InputManager;
var g_TimeManager;

// Stuff run before game starts
function init()
{
	g_GameManager = new GameManager();
	g_GameState = new GameState();
	g_InputManager = new InputManager();
	g_TimeManager = new TimeManager();
	
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

	g_GameManager.Render();
}

$(document).ready(
function ()
{
	// Set up stuff
	init();

	// Begin game loop
	g_TimeManager.Begin(update);
});