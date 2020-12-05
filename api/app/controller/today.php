<?php

    $array['command'] = "today";
    
    $date = new DateTime(date());
    $array['todayDate'] = $date->format('Y-m-d H:i:s');;
    $date->modify('-1 day');
    $array['yesterdayDate'] = $date->format('Y-m-d H:i:s');;
    
    $today = explode(" ", $array['todayDate']);
    $yesterday = explode(" ", $array['yesterdayDate']);
    
    $state_lines = explode("\n", load_file_from_korovnik(STATE_LOG_FILENAME));
    
    // 2020-12-04|02:11:45|
    
    foreach ($state_lines as $line) {
        if ((substr($line,0,10) == $yesterday[0] AND substr($line,11,8) >= $today[1])
                OR (substr($line,0,10) == $today[0] AND substr($line,11,8) <= $today[1])) {
            $array['records'][] = $line;         
        }
    }
    
   