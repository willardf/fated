
Character.prototype.GetPower = function ()
{
    return this.power + this.equipment.GetPower();
};

Character.prototype.GetWDef = function ()
{
    return this.wdef + this.equipment.GetWDef();
};

Character.prototype.GetMDef = function ()
{
    return this.mdef + this.equipment.GetMDef();
};

Character.prototype.GetSpecial = function ()
{
    return this.special + this.equipment.GetSpecial();
};

Character.prototype.GetHealth = function ()
{
    return this.health + this.equipment.GetHealth();
};

Character.prototype.FindEffectKeyword = function (keyword)
{
    for (eff in this.effects)
    {
        if (keyword in this.effects[eff])
        {
            return true;
        }
    }
    return false;
};

Character.prototype.IsBlinded = function ()
{
    return this.FindEffectKeyword("blind");
};

Character.prototype.IsWeakened = function ()
{
    return this.FindEffectKeyword("weak");
};

Character.prototype.IsStunned = function ()
{
    return this.FindEffectKeyword("stun");
};

Character.prototype.Render = function (renderer, locX, locY, width, height)
{
    renderer.drawImage(this.image, locX, locY, width, height);

    var ratio = this.currenthealth / this.GetHealth();

    var r = Math.floor(ratio > .5 ? 512 * (1 - ratio) : 255);
    var g = Math.floor(ratio < .5 ? 512 * ratio : 255);

    var color = "rgba(" + r + "," + g + ",0,1)"

    // First green, add red until .5, then remove green until 0

    var sideShift = (width * 14 / 15);
    renderer.drawBox(locX + sideShift, locY, width / 15, height * ratio, true, color);
};

function Character()
{
    this.name = "Player"
    this.image = "characters/player.png"

	this.health = 30;
	this.currenthealth = 30;
	this.pip = 4;
	this.power = 7;
	this.wdef = 7;
	this.mdef = 7;
	this.special = 0.0;
	
	this.level = 1;
	this.experience = 0;
	this.attributePts = 0;
	
	this.skillclass = "All";
	this.equipment = new CharacterEquipment();
	
	this.skillsLimit = 3;
	this.skills = new Array();	// Holds string indexes to GameManager.GameData.getSkillData(key);
	
	this.skillsSelectedLimit = 5;
	this.skillsSelected = new Array();
	
	this.talents = new Array();	// Ditto, but getTalentData(key);
	this.effects = new Array();
}