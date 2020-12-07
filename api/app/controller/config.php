<?php

    $array['command'] = "config";

    $nightModeStartTime = 18;
    $nightModeGivenTemp = 5;
    
    $dayModeStartTime = 8;
    $dayModeGivenTemp = 9.2;
    
    $weekendModeGivenTemp = 5;
            
    $array['config'] = [
        'nightTime' => $nightModeStartTime,
        'nightTemp' => $nightModeGivenTemp,
        'dayTime' => $dayModeStartTime,
        'dayTemp' => $dayModeGivenTemp,
        'weekendTemp' => $weekendModeGivenTemp,
    ];
    
    