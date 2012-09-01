CharacterEquipment.prototype.GetPower = function()
{
	return this.head.power + this.phand.power + this.ohand.power + this.feet.power;
}

CharacterEquipment.prototype.GetWDef = function()
{
	return this.head.wdef + this.phand.wdef + this.ohand.wdef + this.feet.wdef;
}

CharacterEquipment.prototype.GetMDef = function()
{
	return this.head.mdef + this.phand.mdef + this.ohand.mdef + this.feet.mdef;
}

CharacterEquipment.prototype.GetSpecial = function()
{
	return this.head.special + this.phand.special + this.ohand.special + this.feet.special;
}

CharacterEquipment.prototype.GetHealth = function()
{
	return this.head.health + this.phand.health + this.ohand.health + this.feet.health;
}

function CharacterEquipment()
{
	var empty = {"power" : 0, "wdef" : 0,
		"mdef" : 0, "special" : 0, "health" : 0};s
	this.head = empty;
	this.phand = empty;
	this.ohand = empty;
	this.feet = empty;
}
