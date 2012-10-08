FileManager.prototype.LoadFromFile = function (filename)
{
    var ajaxSettings = {
        async: false,
        url: ("data/" + filename),
        context: destContext,
        success: function (result)
        {
            this.result = result;
        },
        error: function (event, error)
        {
            $("p#errors").html(filename + ": AJAXError=" + error + "</br>");
        },
        dataType: "json"
    };

    $.ajax(ajaxSettings);
    return this.result;
}

function FileManager()
{
}