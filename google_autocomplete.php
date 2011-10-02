<?php
	$val=$_GET["q"];
	$google_query = "http://google.com/complete/search?q=".$val."&hl=en";
	$res = file_get_contents($google_query);
	preg_match('#\((.*?)\)#', $res, $possibilities);
	echo $possibilities[1];	
	
?>