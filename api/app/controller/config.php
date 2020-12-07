<?php

    $array['command'] = "config";

    $url = 'http://'.KOROVNIK_IP.'/'.GET_CONFIG;
    $array['url'] = $url;
    
    $array['config'] = json_decode(file_get_contents($url));
    