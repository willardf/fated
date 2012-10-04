SkillEffect.prototype.ApplyEffect = function(recipient, sender)
{
	if ("damage" in this.data)
	{
		recipient.currentHealth -= this.data.damage;
		g_Renderer.LogText(recipient.name + " takes " + this.data.damage + " damage.");
		flavor = " damaging effect ";
	}
	if ("power" in this.data)
	{
		var damage = sender.GetPower() + this.data.power;
		damage -= skilldata.magical ? target.GetMDef() : target.GetWDef();
		recipient.currentHealth -= damage;
		g_Renderer.LogText(recipient.name + " takes " + this.data.damage + " damage.");
		flavor = " damaging effect ";
	}
	if ("piptrade" in this.data && recipient.pip > this.data.piptrade)
	{
		recipient.pip -= this.data.piptrade;
		sender.pip += this.data.piptrade;
		g_Renderer.LogText(sender.name + " takes "+ this.data.piptrade +" pip(s) from " + recipient.name);
		flavor = " piptrade effect ";
	}
};

SkillEffect.prototype.Save = function()
{
	var remove = true;
	
	if (this.data.ongoing >= 1)
	{
		this.data.ongoing -= 1;
		remove = this.data.ongoing <= 0;
	}
	else if (this.data.ongoing < 1)
	{
		remove = (Math.random() < this.data.ongoing);
	}

	return remove;
};

function SkillEffect(data)
{
	this.data = data;
}