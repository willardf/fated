<!DOCTYPE html>
<html>
<head>

</head>
<body>
<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

	$fname = "data/skills.txt";
	if (array_key_exists("uploadData", $_POST))
	{
		$text = trim($_POST["uploadData"]);
		
		$file = fopen($fname, "w");
		
		echo "Wrote ";
		echo fwrite($file, $text);
		echo " bytes.<br/>\r\n";

		fclose($file);
		touch($fname);
		die("Success");
	} 
?>
<p id="outputT"></p>
<p id="errors"></p>
<p>Please, please, please hit F5 each time you come to this page. It won't refresh right, and I really don't know why.<br/>
You don't have to hit F5 if you just hit submit query. But if you leave and return. F5 it.</p>

	<p id='listOut' class='listOut'></p>
	<input type="button" id="submitButt" value="Save Changes"/>
	<input type="button" id="addButt" value="Add Skill"/>
	
	<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="js/data/GameData.js"></script>
	<script type="text/javascript" src="skillsEdit.js"></script>
	
</body>
</html>