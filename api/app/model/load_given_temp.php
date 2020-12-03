<?php

function load_given_temp(){
    global $array;
    
    $array['fired_functions'][] = 'load_given_temp()';
    
    return 10;
}

