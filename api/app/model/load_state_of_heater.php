<?php

function load_state_of_heater(){
    global $array;
    $array['fired_functions'][] = 'load_state_of_heater()';
    $url = 'http://'.KOROVNIK_IP.'/'.API_URL.urlencode('AT get all');
    $array['url'] = $url;
    
    $state = json_decode(file_get_contents($url));
    
    return $state->answer;
}

