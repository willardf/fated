var g_GameScreen;
var g_GameState;

function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function SubmitSave()
{
	$("#outputT").html("Saving...");
	var f_name = $("input#filename").val();
	var dataOut = JSON.stringify(g_GameScreen.currentScene);
	var ajaxSettings = {
			type: "POST",
			url: ("upload2.php"),
			data: ("fname=" + f_name + "&uploadData=" + dataOut),
			success: function(result)
				{
					$("#outputT").html("Saved to " + f_name);
					$("#outputT").append("<br/>" + result);
				}, 
			error: function(event, request, settings, error)
				{
					$("outputT").html("AJAXError:" + error);
				} 
		};
		
	$.ajax(ajaxSettings);
}

function GenList(objectTree)
{
	if (typeof objectTree === 'string')
	{
		return "";
	}
    var output = "<ul>";
    
    for (key in objectTree)
    {
        var obj = objectTree[key]
        output += "<li>" + key;
        if (typeof obj === 'string')
        {
        	output += " = <input type='text' value=\""+ escapeHtml(obj)+"\"></input>"
        }
        else if (typeof obj === 'number')
        {
        	output += " = <input type='text' value=\""+ obj+"\"></input>"
        }
        output += "</li>";
        output += GenList(obj);
    }
    
    return output + "</ul>";
    
}

$(document).ready(
function()
{
	var f_name = $("input#filename").val();
	g_GameState = new GameState();
	g_GameScreen = new GameScreen(f_name);
	$("p#outputT").html("Loaded " + f_name);
	
	$("#filename").focusout(function(){
			var f_name = $("input#filename").val();
			g_gamescreen.Load(f_name);
			$("p#outputT").html("Loaded " + f_name);
		});
	$("#submitButt").click(SubmitSave)

	var list = GenList(g_GameScreen.currentScene);
    $("p#listOut").html(list);
}
);