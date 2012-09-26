var g_GameData;

function escapeHtml(unsafe) {
  return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

function Skill()
{
	this.name = "newSkill" + new Date().getTime();
	this.pip = 0;
	this.power = 0;
	this.magical = false;
	this.speed = 0;
	this.effects = new Array();
}
function AddSkill()
{
	var newSkill = new Skill()
	g_GameData.skills[newSkill.name] = newSkill;
	regenList();
}
function UpdateFieldData()
{
	$("p#errors").html(this.id);
	
	var where = this.id.split(".");
	var skill = g_GameData.skills[where[0]];

	if (where[1] == '-1')
	{
		var newobj = new Object();
		newobj[this.value] = "0";
		skill.effects.push(newobj);
		regenList();
	}
	else
	{
		var i;
		var found = false;
		for (i = 1; i < where.length - 1; ++i)
		{
			if (where[i + 1] == '-1')
			{
				skill.effects[where[i]][this.value] = 0;
				found = true;
				regenList();
				break;
			}
			else if (where[i] == "effectskey")
			{
				var oldKey = where[++i];
				
				if (this.value != "")
				{
					skill.effects[this.value] = skill.effects[oldKey];					
				}
				delete skill.effects[oldKey];
				
				found = true;
				regenList();
				break;
			} else if (where[i] == "effectsval")
			{
				var idx = where[++i];
				skill.effects[idx][where[++i]] = this.value;
				found = true;
				break;	
			}
			skill = skill[where[i]];		
		}
		if (!found)
		{
			skill[where[i]] = this.value;			
		}
	}
}

function regenList()
{
	var list = GenList(g_GameData.skills);
    $("p#listOut").html(list);
}

function booleanDropDown(id, value)
{
	id = escapeHtml(id);
	return "<select id='"+id+"' onchange='UpdateFieldData.call(this)'>" +
		"<option value='true'>True</option>" +
		
		"<option value='false' " + 
		(value ? "" : "selected='selected'") + 
		">False</option>" +
		
		"</select>";
}

function effectsDropDown(id, value)
{
	id = escapeHtml(id);
	return "<select id='"+id+"' onchange='UpdateFieldData.call(this)'>" +
		"<option value=''>Select an effect</option>" +
		
		"<option value='ongoing'" + 
		(value!="ongoing" ? "" : "selected='selected'") + 
		">Ongoing</option>" +
		
		"<option value='damage'" + 
		(value!="damage" ? "" : "selected='selected'") + 
		">Damage</option>" +
		
		"<option value='power'" + 
		(value!="power" ? "" : "selected='selected'") + 
		">Power</option>" +
		
		"<option value='piptrade'" + 
		(value!="piptrade" ? "" : "selected='selected'") + 
		">PiP Trade</option>" +
		
		"<option value='self'" + 
		(value!="self"? "self" : "selected='selected'") + 
		">Self</option>" +
				
		"<option value='uphealth'" + 
		(value!="uphealth" ? "" : "selected='selected'") + 
		">Health Up</option>" +
		
		"<option value='upmdef'" + 
		(value!="upmdef" ? "" : "selected='selected'") + 
		">Magic Defense Up</option>" +
		
		"<option value='uppower'" + 
		(value!="uppower" ? "" : "selected='selected'") + 
		">Power Up</option>" +
		
		"<option value='upspecial'" + 
		(value!="upspecial" ? "" : "selected='selected'") + 
		">Special Up</option>" +
		
		"<option value='upwdef'" + 
		(value!="upwdef" ? "" : "selected='selected'") + 
		">Weapon Defense Up</option>" +
		
		"</select>";
		
}

function numberTextField(id, value)
{
	id = escapeHtml(id);
	return "<input id='" + id + 
	"' type='text' size='5' value='" + value + 
	"' onblur='UpdateFieldData.call(this)'></input>"
}

function SubmitSave()
{	
	$("#outputT").html("Saving...");
	var f_name = $("input#filename").val();
	
	var objOut = new Object();
	objOut.label = "skills";
	objOut.data = g_GameData.skills;
	
	var dataOut = JSON.stringify(objOut);
	var ajaxSettings = {
			type: "POST",
			url: ("skillsEdit.php"),
			data: ("fname=" + f_name + "&uploadData=" + dataOut),
			success: function(result)
				{
					$("#outputT").html("Saved to " + f_name);
					$("#outputT").append("<br/>" + result);
				},
			error: function(event, error)
				{
					$("outputT").html("AJAXError:" + error);
				} 
		};
		
	$.ajax(ajaxSettings);
}

function GenList(objectTree)
{
    var output = "<ul>";
    
    for (key in objectTree)
    {
        var obj = objectTree[key]
        output += "<li>" + key;

		output += "<ul>";        
        output += "<li>pip="
        output += numberTextField(key + ".pip", obj.pip);
        output += " power="
        output += numberTextField(key + ".power", obj.power);
        output += " magical="
        output += booleanDropDown(key + ".magical", obj.magical);
        output += " speed="
        output += numberTextField(key + ".speed", obj.speed);
        output += "</li>";
        
        output += "<li>effects"
        output += "<ul>";
        
        if (obj.effects == undefined)
        	obj.effects = new Array();
        
        for (var e = 0; e < obj.effects.length; e++)
        {
        	var effect = obj.effects[e];
        	
        	output += "<li>";
        	for (p in effect)
        	{
        		output += effectsDropDown(key + ".effectskey." + e + "." + p, p);
        		output += numberTextField(key + ".effectsval." + e + "." + p, effect[p]);
        		output += " "        		
        	}
        	output += effectsDropDown(key + "." + e + ".-1");
        	
        	output += "</li>";
        }
        
        output += "<li>";
        output += effectsDropDown(key + ".-1");
        output += "</li>";
        
        output += "</ul>";
        
        output += "</li>";
        
        output += "</ul>";
        // Handle Effects
        //output += GenList(obj);
    }
    
    return output + "</ul>";
    
}

$(document).ready(
function()
{
	var f_name = "data/skills.txt";
	g_GameData = new GameData();
	$("p#outputT").html("Loaded " + f_name);
	
	$("#filename").focusout(function(){
			var f_name = $("input#filename").val();
			g_gamescreen.Load(f_name);
			$("p#outputT").html("Loaded " + f_name);
		});
	$("#submitButt").click(SubmitSave)
	$("#addButt").click(AddSkill)

	regenList();
}
);