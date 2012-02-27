<?php
	$val=$_GET["q"];
	$google_query = "http://suggestqueries.google.com/complete/search?client=firefox&q=".$val;
	$res = file_get_contents($google_query);
	echo $res;
	//preg_match('#\((.*?)\)#', $res, $possibilities);
	//echo $possibilities[1];	
	
?>