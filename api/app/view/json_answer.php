<?php

header('Access-Control-Allow-Origin: *');
header("Content-Type: application/json");


echo json_encode($array, JSON_UNESCAPED_UNICODE);

exit;
