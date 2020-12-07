<?php

    $array['command'] = "config";

    $nightModeStartTime = 18;
    $nightModeGivenTemp = 5;
    
    $dayModeStartTime = 8;
    $dayModeGivenTemp = 9.2;
    
    $weekendModeGivenTemp = 5;

    $url = 'http://'.KOROVNIK_IP.'/'.GET_CONFIG;
    $array['url'] = $url;
    
    $array['config'] = json_decode(file_get_contents($url));
    