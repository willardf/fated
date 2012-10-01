/**
 * @author Forest
 */

Renderer.prototype.drawText = function(text)
{
	this.midtext += text;
}

Renderer.prototype.LogText = function(text)
{
	$("#log").append(text + "<br/>");
}

Renderer.prototype.Finish = function()
{
	$("#outputM").html(this.midtext);
	this.midtext = "";
	
}

function Renderer()
{
	this.midtext = "";
}
