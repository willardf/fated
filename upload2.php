<!DOCTYPE html>
<html>
<head>

</head>
<body>
<?php
	if (array_key_exists("fname", $_GET))
	{
		$fname = trim($_GET["fname"]);
	}
	else
	{
		$fname = "scenes/begin.txt";
	}
	if (array_key_exists("uploadField", $_POST))
	{
		$text = trim($_POST["uploadField"]);
		
		$file = fopen($fname, "w");
		
		fwrite($file, $text);
			
		fclose($file);
		touch($fname);
		echo "Data Saved to " .  $fname . ".<br/>";
	}
?>
<p id="outputT"></p>
<p>Please, please, please hit F5 each time you come to this page. It won't refresh right, and I really don't know why.<br/>
You don't have to hit F5 if you just hit submit query. But if you leave and return. F5 it.</p>

	<p id='listOut' class='listOut'></p>

	Filename: <?php echo "<input type=\"textbox\" id='filename' value=\"$fname\"/>"; ?><br/>
	<form name="myWebForm" action="upload.php?fname=scenes/begin.txt" method="post">
	<?php echo "<input type=\"hidden\" name=\"fname\" id='fname' value=\"$fname\"/>"; ?><br/>
	<input type="submit" />
	</form>
	
	<script type="text/javascript" src="js/jquery-1.8.0.min.js"></script>
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