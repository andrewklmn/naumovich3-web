<?php

function load_file_from_korovnik($name) {

    global $array;

    $array['fired_functions'][] = 'load_file_from_korovnik('.$name.')';
    $url = 'http://'.KOROVNIK_IP.'/'.GET_FILE_URL.urlencode($name);
    $array['url'] = $url;
    
    return file_get_contents($url);
}
