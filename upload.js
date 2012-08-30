var g_data;

function updateText()
{
    var f_name = $("input#filename").val();
    $("form#myWebForm").attr("action", "upload.php?fname="+f_name);
    var ajaxSettings = {
			async: false,
			url: (f_name),
			success: function(result)
				{
					g_data = result;
				}, 
			error: function(event, request, settings, error)
				{
					$("outputT").html("AJAXError:" + error);
				},
			dataType: "json" 
		};
	$.ajax(ajaxSettings);
    $("p#outputT").html("Loaded " + f_name);
}

function GenList(objectTree)
{
    var output = "<ul>";
    
    for (key in objectTree)
    {
        var obj = objectTree[key]
        output += "<li>" + key + "</li>";
        if (obj.length != undefined && obj.length > 0)
        {
            output += GenList(obj);
        }
    }
    
    return output + "</ul>";
    
}

$(document).ready(
function()
{
	updateText();
	$("#filename").focusout(updateText);

	var list = GenList(g_data);
    $("p#listOut").html(list);
}
);