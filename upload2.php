<!DOCTYPE html>
<html>
<head>

</head>
<body>
<?php
	if (array_key_exists("fname", $_REQUEST))
	{
		$fname = trim($_REQUEST["fname"]);
	}
	else
	{
		$fname = "begin.txt";
	}
	if (array_key_exists("uploadData", $_POST))
	{
		$text = trim($_POST["uploadData"]);
		
		$file = fopen("scenes/" . $fname, "w");
		
		echo "Wrote ";
		echo fwrite($file, $text);
		echo " bytes.<br/>\r\n";
			
		fclose($file);
		touch($fname);
		die("Success");
	}
?>
<p id="outputT"></p>
<p>Please, please, please hit F5 each time you come to this page. It won't refresh right, and I really don't know why.<br/>
You don't have to hit F5 if you just hit submit query. But if you leave and return. F5 it.</p>

	<p id='listOut' class='listOut'></p>

	Filename: <?php echo "<input type=\"textbox\" id='filename' value=\"$fname\"/>"; ?><br/>
	<input type="button" id="submitButt" value="Save Changes"/>
	
	
	<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
	<script type="text/javascript" src="js/data/GameState.js"></script>
	<script type="text/javascript" src="js/screens/GameScreen.js"></script>
	<script type="text/javascript" src="upload.js"></script>
	
	Story files:<br/>
	<?php
		//get all image files with a .jpg extension.
		$files = glob("scenes/*.txt");
		 
		//print each file name
		foreach($files as $fn)
		{
			echo $fn . "<br/>";
		}
	?>
</body>
</html>