<?php

    $array['command'] = "temp";
    
    $temp = round($_REQUEST['temp']*10)/10;
    
    if($_REQUEST['temp'] < MIN_GIVEN_TEMP) $temp = MIN_GIVEN_TEMP;
    if($_REQUEST['temp'] > MAX_GIVEN_TEMP) $temp = MAX_GIVEN_TEMP;
    
    $array['fired_functions'][] = 'set_temp('.$temp.')';
    $url = 'http://'.KOROVNIK_IP.'/'.SET_TEMP.$temp;
    $array['url'] = $url;
    
    $array['stdout'] = file_get_contents($url);
    $array['givenTemp'] = $temp;
