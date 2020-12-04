<?php

function get_controller_names_array($array) {
    
    global $array;
    
    $array['fired_functions'][] = 'get_controller_names_array()';
    
    $commands = [
        'week',
        'today',
        'temp',
    ];
    
    return $commands;
}

