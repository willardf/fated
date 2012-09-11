// Calls update callback, sets up next refresh tick. 
TimeManager.prototype.Update = function()
{
	
	this.oldTime = this.newTime;
	this.newTime = new Date().getTime();
	this.lastFrame = (this.newTime - this.oldTime) / 1000.0;
	
	this.updateFunct(this.lastFrame);
	
	setTimeout(do_TimeManager_Update, 1000 / c_FPS);
}

// Creates an indirection to preserve "this" in the timer callback
// TODO: The need for this indirection might be relieved by using function.call(this) or function.apply(this)
function do_TimeManager_Update()
{
	g_TimeManager.Update();
}

// Starts the game loop 
TimeManager.prototype.Begin = function(updateFunct)
{
	this.updateFunct = updateFunct;
	do_TimeManager_Update();
}

// Default constructor, inits time variables
function TimeManager()
{
	
	this.oldTime = new Date().getTime();
	this.newTime = new Date().getTime();
	this.lastFrame = 0.0;
}