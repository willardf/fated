// Input Manager keeps track of button presses
// It is intended to be a static, global member.
// It automatically registers itself with $(document).<keyevent>

// Event Handlers
InputManager.prototype.KeyDown = function(e)
{
	this.i_KeysDownCurr[e.which] = true;
}
InputManager.prototype.KeyUp = function(e)
{
	this.i_KeysDownCurr[e.which] = false;
}

// Public Functions
/*
* IsKeyUniqueDown
*
* Returns true only on the frame that a button is pressed
* If someone pressed and released faster than 1/30th sec,
* it wouldn't be registered.
*/
InputManager.prototype.IsKeyUniqueDown = function(which)
{
	if (which in this.i_KeysDownCurr)
	{
		if (!(which in this.i_KeysDownLast))
		{
			return true;
		}
		else
		{
			return this.i_KeysDownCurr[which] && !this.i_KeysDownLast[which];
		}
	}
	else
	{
		return false;
	}
}

/*
 * Update
 * Moves the last frame's buttons to the old array.
 */
InputManager.prototype.Update = function()
{
	// slice makes a copy instead of a reference
	this.i_KeysDownLast = this.i_KeysDownCurr.slice();
}

// Constructor
function InputManager()
{
	this.i_KeysDownCurr = new Array();
	this.i_KeysDownLast = new Array();

	this.c_SpaceBar = 32;
	this.c_Enter = 13;
	this.c_UpArrow = 38;
	this.c_DownArrow = 40;

	$(document).keydown(function (e) { g_InputManager.KeyDown(e) });
	$(document).keyup(function (e) { g_InputManager.KeyUp(e) });
}