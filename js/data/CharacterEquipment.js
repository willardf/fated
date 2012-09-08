CharacterEquipment.prototype.GetPower = function()
{
	var head = g_GameManager.GameData.GetEquipmentData(this.head);
	var phand = g_GameManager.GameData.GetEquipmentData(this.phand);
	var ohand = g_GameManager.GameData.GetEquipmentData(this.ohand);
	var feet = g_GameManager.GameData.GetEquipmentData(this.feet);
	return head.power + phand.power + ohand.power + feet.power;
}

CharacterEquipment.prototype.GetWDef = function()
{
	var head = g_GameManager.GameData.GetEquipmentData(this.head);
	var phand = g_GameManager.GameData.GetEquipmentData(this.phand);
	var ohand = g_GameManager.GameData.GetEquipmentData(this.ohand);
	var feet = g_GameManager.GameData.GetEquipmentData(this.feet);
	return head.wdef + phand.wdef + ohand.wdef + feet.wdef;
}

CharacterEquipment.prototype.GetMDef = function()
{
	var head = g_GameManager.GameData.GetEquipmentData(this.head);
	var phand = g_GameManager.GameData.GetEquipmentData(this.phand);
	var ohand = g_GameManager.GameData.GetEquipmentData(this.ohand);
	var feet = g_GameManager.GameData.GetEquipmentData(this.feet);
	return head.mdef + phand.mdef + ohand.mdef + feet.mdef;
}

CharacterEquipment.prototype.GetSpecial = function()
{
	var head = g_GameManager.GameData.GetEquipmentData(this.head);
	var phand = g_GameManager.GameData.GetEquipmentData(this.phand);
	var ohand = g_GameManager.GameData.GetEquipmentData(this.ohand);
	var feet = g_GameManager.GameData.GetEquipmentData(this.feet);
	return head.special + phand.special + ohand.special + feet.special;
}

CharacterEquipment.prototype.GetHealth = function()
{
	var head = g_GameManager.GameData.GetEquipmentData(this.head);
	var phand = g_GameManager.GameData.GetEquipmentData(this.phand);
	var ohand = g_GameManager.GameData.GetEquipmentData(this.ohand);
	var feet = g_GameManager.GameData.GetEquipmentData(this.feet);
	return head.health + phand.health + ohand.health + feet.health;
}

function CharacterEquipment()
{
	this.head = "Empty";
	this.phand = "Empty";
	this.ohand = "Empty";
	this.feet = "Empty";
}
