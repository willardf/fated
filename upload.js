function updateText()
{
    var fname = $("input#filename").val();
    $("form#myWebForm").attr("action", "upload.php?fname="+fname);
    $("textarea").load(fname);
}

function newFile()
{
    $("textarea").html("This file doesn't seem to exist.\n");
    $("textarea").append("If you submit, it will be created.");
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

$(document).ready(function()
{
    $("textarea").ajaxError(newFile);
    $("#filename").focusout(updateText);
    
    var list = GenList(JSON.parse($("textarea").val()));
    $("p#listOut").html(list);
});