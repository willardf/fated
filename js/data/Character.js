/*
 * TODO: Very unfinished 
 */
Character.prototype.GetPower = function()
{
	return this.power + this.equipment.GetPower();
}

Character.prototype.GetWDef = function()
{
	return this.wdef + this.equipment.GetWDef();
}

Character.prototype.GetMDef = function()
{
	return this.mdef + this.equipment.GetMDef();
}

Character.prototype.GetSpecial = function()
{
	return this.special + this.equipment.GetSpecial();
}

Character.prototype.GetHealth = function()
{
	return this.health + this.equipment.GetHealth();
}

function Character()
{
	this.health = 30;
	this.pip = 4;
	this.power = 7;
	this.wdef = 7;
	this.mdef = 7;
	this.special = 0.0;
	
	this.skillclass = "All";
	this.equipment = new CharacterEquipment();
	this.skills = [];	// Holds string indexes to GameManager.GameData.getSkillData(key);
	this.talents = [];	// Ditto, but getTalentData(key);
}