Condition.prototype.GetResult = function()
{
	return this.result;
};

Condition.prototype.EvalCondition = function()
{
	this.result = false;
	if ("key" in this.data)
	{
		this.result = g_GameState.GetFlag(this.data.key) == this.data.val;
	}
	else if ("random" in this.data)
	{
		this.result = Math.random() < this.data.random;
	}
	else if ("stat" in this.data)
	{
		var split = this.data.stat.split(".");
		var target = undefined;
		if (split[0] == "_player")
		{
			target = g_GameState.playerCharacter;
		}
		else
		{
			for (idx in this.data.turnOrder)
			{
				var temp = this.data.turnOrder[idx];
				if (temp == g_GameState.playerCharacter) continue;
				if (temp.name == split[0])
				{
					target = temp;
					break;
				}
			}
		}
		// TODO: this needs to be expanded
		if (target != undefined)
		{
			if (split[1] == "hp")
			{
				this.result = target.currenthealth <= this.data.val;
			}
		}
	}
};

function Condition(data)
{
	this.data = data;
	this.EvalCondition();
}