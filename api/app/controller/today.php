<?php

    $array['command'] = "today";
    
    $today = date("Y-m-d");
    $array['todayIs'] = $today;
    
    
    $state_lines = explode("\n", load_file_from_korovnik(STATE_LOG_FILENAME));
    
    foreach ($state_lines as $line) {
        if (substr($line,0,10) == $today) {
            $array['records'][] = $line;         
        }
    }
    
   