CharacterEquipment.prototype.GetPower = function()
{
	var head = g_GameData.GetEquipmentData(this.head);
	var phand = g_GameData.GetEquipmentData(this.phand);
	var ohand = g_GameData.GetEquipmentData(this.ohand);
	var feet = g_GameData.GetEquipmentData(this.feet);
	return head.power + phand.power + ohand.power + feet.power;
};

CharacterEquipment.prototype.GetWDef = function()
{
	var head = g_GameData.GetEquipmentData(this.head);
	var phand = g_GameData.GetEquipmentData(this.phand);
	var ohand = g_GameData.GetEquipmentData(this.ohand);
	var feet = g_GameData.GetEquipmentData(this.feet);
	return head.wdef + phand.wdef + ohand.wdef + feet.wdef;
};

CharacterEquipment.prototype.GetMDef = function()
{
	var head = g_GameData.GetEquipmentData(this.head);
	var phand = g_GameData.GetEquipmentData(this.phand);
	var ohand = g_GameData.GetEquipmentData(this.ohand);
	var feet = g_GameData.GetEquipmentData(this.feet);
	return head.mdef + phand.mdef + ohand.mdef + feet.mdef;
};

CharacterEquipment.prototype.GetSpecial = function()
{
	var head = g_GameData.GetEquipmentData(this.head);
	var phand = g_GameData.GetEquipmentData(this.phand);
	var ohand = g_GameData.GetEquipmentData(this.ohand);
	var feet = g_GameData.GetEquipmentData(this.feet);
	return head.special + phand.special + ohand.special + feet.special;
};

CharacterEquipment.prototype.GetHealth = function()
{
	var head = g_GameData.GetEquipmentData(this.head);
	var phand = g_GameData.GetEquipmentData(this.phand);
	var ohand = g_GameData.GetEquipmentData(this.ohand);
	var feet = g_GameData.GetEquipmentData(this.feet);
	return head.health + phand.health + ohand.health + feet.health;
};

function CharacterEquipment(data)
{

	this.head = data ? data.head : "Empty";
	this.phand = data ? data.phand : "Empty";
	this.ohand = data ? data.ohand : "Empty";
	this.feet = data ? data.feet : "Empty";
}
