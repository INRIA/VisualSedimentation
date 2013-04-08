<?PHP

	date_default_timezone_set("Europe/Paris");	
	// CACHE MECHANISM

/*
	$today = date("m-d-y");
	$yesterday = date("m-d-y", time() - 60 * 60 * 24);

	echo "tokens-".$yesterday.".json";

	$today_strata_file = "tokens-".$today.".json";
	$yesterday_strata_file = "tokens-".$yesterday.".json";
	$default_strata_file = "tokens-default.json";


		//$string = file_get_contents("http://127.0.0.1:8082/countAll");
	$string = file_get_contents("datasets.json");
	//echo $string;
*/

	//


	//$last_tokens = file_get_contents("http://localhost/www-tests/nodeTwitter/public/last_tokens.json");
	$last_tokens = utf8_encode(file_get_contents("http://footics.lri.fr/last_tokens.json"));

	$obj_last_tokens = json_decode($last_tokens, true);

	$stream = file_get_contents("http://footics.lri.fr/last_stream.json");

	$obj_stream = json_decode($stream, true);

	$result = array_merge_recursive($obj_last_tokens, $obj_stream) ;

	$final = json_encode($result);

	echo $final;
	//print_r($obj_last_tokens)
	//echo $obj_last_tokens; // 12345

?>