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
	this.head = {};
	this.phand = {};
	this.ohand = {};
	this.feet = {};
}
