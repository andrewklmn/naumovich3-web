<?php

function load_given_temp(){
    global $array;
    
    $array['fired_functions'][] = 'load_given_temp()';
    $modesLog = explode("\n",load_file_from_korovnik(LOG_FILENAME));
    
    $words = explode(' ', $modesLog[count($modesLog)-2]);
    
    $temp = $words[4];
    
    //if ((int)$temp < MIN_GIVEN_TEMP) $temp = MIN_GIVEN_TEMP;
    if ((int)$temp > MAX_GIVEN_TEMP ) $temp = MAX_GIVEN_TEMP;
    
    return $temp;
}

